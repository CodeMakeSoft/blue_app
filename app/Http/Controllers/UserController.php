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
    
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/User', [
            'users' => User::with('roles')->paginate(10),
            'roles' => Role::all(),
            'activeRoute' => $request->route()->getName(),
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
            'phone.unique' => 'Ese número de teléfono ya está en uso por otro usuario.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'email_verified_at' => now() 
        ]);
        
        $user->syncRoles($request->roles);

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
        'phone.unique' => 'Ese número de teléfono ya está en uso por otro usuario.',
    ]);

    $data = $request->only(['name', 'email', 'phone','email_verified_at']);
    if ($request->password) {
        $data['password'] = $request->password;
    }

    $user->update($data);
    $user->syncRoles($request->roles);

    return redirect()->back()->with('success', 'User updated successfully');
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $adminRole = app('adminRole');
        // Verificar si el usuario a eliminar es Admin
        if ($user->hasRole($adminRole->name)) {
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

}