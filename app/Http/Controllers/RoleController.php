<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Inertia\Response;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Http\Controllers\Controller;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Validation\Rule;

class RoleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('role:Admin|Manager'),
            new Middleware('permission:role-create', only: ['store']),
            new Middleware('permission:role-edit', only: ['update']),
            new Middleware('permission:role-delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $roles = Role::with('permissions')->paginate(10);
        $permissions = Permission::all(); // Obtener todos los permisos

        return Inertia::render('Admin/Role', [
            'roles' => $roles,
            'permissions' => $permissions,
            'activeRoute' => request()->route()->getName(),
            'can' => [
                'role_edit'   => $request->user() ? $request->user()->can('role-edit') : false,
                'role_delete' => $request->user() ? $request->user()->can('role-delete') : false,
                'role_create' => $request->user() ? $request->user()->can('role-create') : false,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Solo letras (incluye acentos), números y espacios
        $validated = $request->validate(
            [
                'name' => [
                    'required',
                    'string',
                    'max:40',
                    'regex:/^[\pL\pN\s]+$/u',
                    'unique:roles,name',
                ],
                'permissions' => ['nullable', 'array'],
                'permissions.*' => ['string', 'distinct'],
            ],
            [
                'name.regex' => 'El nombre solo puede contener letras, números y espacios.',
            ]
        );

        $role = Role::create(['name' => $validated['name']]);
        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Role created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        // (Opcional) Evitar renombrar el rol Admin
        if ($role->name === 'Admin' && $request->name !== 'Admin') {
            return back()->with('error', 'No se puede renombrar el rol Admin');
        }

        $validated = $request->validate(
            [
                'name' => [
                    'required',
                    'string',
                    'max:40',
                    'regex:/^[\pL\pN\s]+$/u',
                    Rule::unique('roles', 'name')->ignore($role->id),
                ],
                'permissions' => ['nullable', 'array'],
                'permissions.*' => ['string', 'distinct'],
            ],
            [
                'name.regex' => 'El nombre solo puede contener letras, números y espacios.',
            ]
        );

        $role->update(['name' => $validated['name']]);
        $role->syncPermissions($validated['permissions'] ?? []);

        return redirect()->back()->with('success', 'Role updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        if ($role->name === 'Admin') {
            return back()->with('error', 'No se puede eliminar el rol Admin');
        }
        $role->delete();
        return redirect()->route('roles.index')->with('success', 'Role Deleted Succesfully.');
    }
}
