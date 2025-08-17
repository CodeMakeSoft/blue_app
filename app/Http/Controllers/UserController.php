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
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

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
    
    /**
     * Display a listing of the resource.
     */
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
                    'roles' => $request->user()->roles->pluck('name'), // Array de strings
                    'permissions' => $request->user()->getPermissionNames(), // Array de strings
                ]
            ],
            'can' => [
                'user_view' => $request->user()?->can('user-view'),
                'user_create' => $request->user()?->can('user-create'), 
                'user_edit' => $request->user()?->can('user-edit'),
                'user_delete' => $request->user()?->can('user-delete'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|unique:users,phone',
            'roles' => 'array',
        ], [
            'phone.unique' => 'Ese número de teléfono ya está en uso por otro usuario.',
        ]);

        // Validación adicional para SuperAdmin
        if ($request->has('roles') && !empty($request->roles)) {
            $this->validateSuperAdminAssignment($request->roles);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'email_verified_at' => now() 
        ]);
        
        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        return redirect()->back()->with('success', 'User created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:8',
            'phone' => 'nullable|string|unique:users,phone,' . $user->id,
            'roles' => 'array',
            'email_verified_at' => 'nullable|date',
        ], [
            'phone.unique' => 'Ese número de teléfono ya está en uso por otro usuario.',
        ]);

        // Validación adicional para SuperAdmin
        if ($request->has('roles') && !empty($request->roles)) {
            $this->validateSuperAdminAssignment($request->roles, $user->id);
        }

        $data = $request->only(['name', 'email', 'phone','email_verified_at']);
        if ($request->password) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);
        
        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        return redirect()->back()->with('success', 'User updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Proteger SuperAdmin de eliminación
        if ($user->hasRole(self::SUPER_ADMIN)) {
            Log::warning('Intento de eliminar SuperAdmin', [
                'target_user' => $user->id,
                'attempter' => Auth::id()
            ]);
            return redirect()->back()
                ->with('error', 'No se puede eliminar al SuperAdmin del sistema.');
        }

        // Obtener el rol Admin directamente
        $adminRole = Role::findByName('Admin');
        
        // Verificar si el usuario a eliminar es Admin
        if ($adminRole && $user->hasRole('Admin')) {
            // Contar cuántos usuarios tienen el rol Admin
            $adminUsersCount = $adminRole->users()->count();
            // Si solo queda 1 admin, no permitir eliminarlo
            if ($adminUsersCount <= 1) {
                return redirect()->back()
                    ->with('error', 'No puedes eliminar al último administrador.');
            }
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