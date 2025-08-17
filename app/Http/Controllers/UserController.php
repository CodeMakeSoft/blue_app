<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Auth\Events\Registered;
use App\Mail\WelcomeMail;
use Illuminate\Validation\Rule;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{
    const SUPER_ADMIN = 'SuperAdmin';

    public static function middleware(): array
    {
        return [
            new Middleware('role:SuperAdmin|Admin'), // Solo SuperAdmin y Admin
            new Middleware('permission:user-view', only: ['index']),
            new Middleware('permission:user-create', only: ['store']),
            new Middleware('permission:user-edit', only: ['update']),
            new Middleware('permission:user-delete', only: ['destroy']),
            new Middleware('protect.last.admin', only: ['destroy']),
            new Middleware('single.superadmin', only: ['store', 'update', 'updateRoles']),
        ];
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/User', [
            'users' => User::with('roles')->paginate(10),
            'roles' => Role::all(),
            'activeRoute' => $request->route()->getName(),
            'auth' => [
                'user' => [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'roles' => $request->user()->roles->pluck('name'),
                    'permissions' => $request->user()->getPermissionNames(),
                ]
            ],
            'can' => [
                'user_view'   => $request->user()?->can('user-view'),
                'user_create' => $request->user()?->can('user-create'),
                'user_edit'   => $request->user()?->can('user-edit'),
                'user_delete' => $request->user()?->can('user-delete'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        // Normaliza espacios
        $request->merge([
            'name' => is_string($request->name) ? trim(preg_replace('/\s+/', ' ', $request->name)) : $request->name,
            'phone' => is_string($request->phone) ? trim($request->phone) : $request->phone,
            'email' => is_string($request->email) ? trim($request->email) : $request->email,
        ]);

        // Solo letras (unicode), números y espacios
        $nameRule = ['required','string','max:255','regex:/^[\pL\pN\s]+$/u'];

        $validated = $request->validate([
            'name'     => $nameRule,
            'email'    => ['required','email','max:255','unique:users,email'],
            'password' => ['required','string','min:8'],
            'phone'    => ['nullable','string','unique:users,phone'],
            'roles'    => ['array'],
        ], [
            'name.regex'   => 'El nombre solo puede contener letras, números y espacios.',
            'phone.unique' => 'Ese número de teléfono ya está en uso por otro usuario.',
        ]);

        // Validación adicional para SuperAdmin
        if ($request->has('roles') && !empty($request->roles)) {
            $this->validateSuperAdminAssignment($request->roles);
        }

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'phone'    => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
        ]);

        $user->syncRoles($validated['roles'] ?? []);

        // 1) Verificación de email
        event(new Registered($user));

        // 2) Bienvenida
        Mail::to($user->email)->send(new WelcomeMail($user));

        return redirect()->back()->with('success', 'Usuario creado. Enviamos correo de verificación y de bienvenida.');
    }

    public function update(Request $request, User $user)
    {
        // Normaliza espacios
        $request->merge([
            'name' => is_string($request->name) ? trim(preg_replace('/\s+/', ' ', $request->name)) : $request->name,
            'phone' => is_string($request->phone) ? trim($request->phone) : $request->phone,
            'email' => is_string($request->email) ? trim($request->email) : $request->email,
        ]);

        $nameRule = ['required','string','max:255','regex:/^[\pL\pN\s]+$/u'];

        $validated = $request->validate([
            'name'  => $nameRule,
            'email' => ['required','email','max:255', Rule::unique('users','email')->ignore($user->id)],
            'password' => ['nullable','string','min:8'],
            'phone' => ['nullable','string', Rule::unique('users','phone')->ignore($user->id)],
            'roles' => ['array'],
            'email_verified_at' => ['nullable','date'],
        ], [
            'name.regex'   => 'El nombre solo puede contener letras, números y espacios.',
            'phone.unique' => 'Ese número de teléfono ya está en uso por otro usuario.',
        ]);

        $emailChanged = $validated['email'] !== $user->email;

        $data = [
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        if ($emailChanged) {
            $data['email_verified_at'] = null;
        } elseif (!empty($validated['email_verified_at'])) {
            $data['email_verified_at'] = $validated['email_verified_at'];
        }

        $user->update($data);
        $user->syncRoles($validated['roles'] ?? []);

        if ($emailChanged) {
            $user->sendEmailVerificationNotification();
            return redirect()->back()->with('success', 'Usuario actualizado. Reenviamos el enlace de verificación al nuevo correo.');
        }

        return redirect()->back()->with('success', 'Usuario actualizado correctamente');
    }

    public function destroy(User $user)
    {
        $adminRole = app('adminRole');

        if ($user->hasRole($adminRole->name)) {
            $adminUsersCount = $adminRole->users()->count();
            if ($adminUsersCount <= 1) {
                return redirect()->back()
                    ->with('error', 'No puedes eliminar al último administrador.');
            }
        }

        if ($user->hasRole(self::SUPER_ADMIN)) {
            Log::warning('Intento de eliminar SuperAdmin', [
                'target_user' => $user->id,
                'attempter' => Auth::id()
            ]);
            return redirect()->back()
                ->with('error', 'No se puede eliminar al SuperAdmin del sistema.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'Usuario eliminado correctamente');
    }

    public function updateRoles(Request $request, User $user)
    {
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id'
        ]);

        // Validación adicional para SuperAdmin
        $this->validateSuperAdminAssignment([$validated['role_id']], $user->id);

        // Limpiar roles existentes primero
        $user->syncRoles([$validated['role_id']]);

        return redirect()->route('users.index')
            ->with('success', 'Roles actualizados correctamente');
    }

    /**
     * Validar la asignación del rol SuperAdmin
     */
    private function validateSuperAdminAssignment(array $roleIds, int $excludeUserId = null)
    {
        try {
            $superAdminRole = Role::where('name', self::SUPER_ADMIN)->first();

            if (!$superAdminRole) {
                return;
            }

            // Si SuperAdmin está en los roles a asignar
            if (in_array($superAdminRole->id, $roleIds) || in_array((string)$superAdminRole->id, $roleIds)) {
                $query = $superAdminRole->users();

                // Excluir el usuario actual si se está editando
                if ($excludeUserId) {
                    $query->where('users.id', '!=', $excludeUserId);
                }

                $existingSuperAdmin = $query->first();

                if ($existingSuperAdmin) {
                    Log::warning('Intento de crear múltiple SuperAdmin bloqueado en controller', [
                        'existing_superadmin' => $existingSuperAdmin->id,
                        'exclude_user' => $excludeUserId,
                        'attempter' => Auth::id()
                    ]);

                    throw new \Illuminate\Validation\ValidationException(
                        validator([], []),
                        [
                            'roles' => ['Ya existe un SuperAdmin en el sistema. Solo puede haber uno.']
                        ]
                    );
                }
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Error en validación de SuperAdmin', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'trace' => $e->getTraceAsString()
            ]);
            throw new \Exception('Error interno en la validación de roles.');
        }
    }
}
