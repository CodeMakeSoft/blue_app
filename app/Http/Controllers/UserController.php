<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeMail;
use Illuminate\Validation\Rule;

class UserController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('role:Admin|Manager'),
            new Middleware('permission:can-access-admin-panel'),
            new Middleware('permission:user-view', only: ['index']),
            new Middleware('permission:user-create', only: ['store']),
            new Middleware('permission:user-edit', only: ['update']),
            new Middleware('permission:user-delete', only: ['destroy']),
            new Middleware('protect.last.admin', only: ['destroy']),
        ];
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/User', [
            'users' => User::with('roles')->paginate(10),
            'roles' => Role::all(),
            'activeRoute' => $request->route()->getName(),
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

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'phone'    => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
        ]);

        $user->syncRoles($validated['roles'] ?? []);

        // 1) Verificación de email (enlace firmado)
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

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'Usuario eliminado correctamente');
    }
}
