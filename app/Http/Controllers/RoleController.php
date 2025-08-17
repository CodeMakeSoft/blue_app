<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class RoleController extends Controller implements HasMiddleware
{
    // Roles que no deben eliminarse ni renombrarse
    protected array $protectedRoles = ['SuperAdmin', 'Admin'];

    public static function middleware(): array
    {
        return [
            // Ahora cualquier usuario con SuperAdmin o Admin puede acceder
            new Middleware('role:SuperAdmin|Admin'),
            new Middleware('permission:role-create', only: ['store']),
            new Middleware('permission:role-edit', only: ['update']),
            new Middleware('permission:role-delete', only: ['destroy']),
        ];
    }

    public function index(Request $request): Response
{
    $roles = Role::with('permissions')->paginate(10);
    $permissions = Permission::all();

    // Roles del usuario autenticado como array de strings
    $userRoles = $request->user()?->roles->pluck('name') ?? collect();

    return Inertia::render('Admin/Role', [
        'roles' => $roles,
        'permissions' => $permissions,
        'activeRoute' => request()->route()->getName(),
        'can' => [
            'role_edit' => $request->user()?->can('role-edit') ?? false,
            'role_delete' => $request->user()?->can('role-delete') ?? false,
            'role_create' => $request->user()?->can('role-create') ?? false,
        ],
        'auth' => [
            'user' => [
                'id' => $request->user()?->id,
                'name' => $request->user()?->name,
                'email' => $request->user()?->email,
                'roles' => $userRoles,
                'permissions' => $request->user()?->getPermissionNames(),
            ],
        ],
    ]);
}


    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required', 'string', 'max:40', 'unique:roles,name',
                'not_in:' . implode(',', $this->protectedRoles),
            ],
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return redirect()->back()->with('success', 'Role created successfully');
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:40',
            'permissions' => 'array',
        ]);

        if (in_array($role->name, $this->protectedRoles)) {
            // Solo actualiza permisos para roles protegidos
            $role->syncPermissions($request->permissions);
            return redirect()->back()->with('success', "Permissions updated successfully for {$role->name}");
        }

        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return redirect()->back()->with('success', 'Role updated successfully');
    }

    public function destroy(Role $role)
    {
        if (in_array($role->name, $this->protectedRoles)) {
            return back()->with('error', "No se puede eliminar el rol {$role->name}");
        }

        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }
}