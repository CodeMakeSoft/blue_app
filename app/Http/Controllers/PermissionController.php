<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class PermissionController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            // Updated to match your RoleSeeder: SuperAdmin, Admin, Seller
            new Middleware('role:SuperAdmin'),
            new Middleware('permission:permission-view', only: ['index']),
            new Middleware('permission:permission-create', only: ['store']),
            new Middleware('permission:permission-edit', only: ['update']),
            new Middleware('permission:permission-delete', only: ['destroy']),
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $permissions = Permission::paginate(10);
        
        return Inertia::render('Admin/Permission', [
            'permissions' => $permissions,
            'activeRoute' => $request->route()->getName(),
            'can' => [
                // Fixed naming consistency - using underscores to match frontend
                'permission_edit' => $request->user()?->can('permission-edit') ?? false,
                'permission_delete' => $request->user()?->can('permission-delete') ?? false,
                'permission_create' => $request->user()?->can('permission-create') ?? false,
                'permission_view' => $request->user()?->can('permission-view') ?? false,
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
    public function store(Request $request)
    {
        // Fixed validation - removed Permission parameter since it's for creating new permissions
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);

        $data = $request->only(['name']);

        Permission::create($data);
        
        // Return JSON response for better frontend handling
        return response()->json([
            'message' => 'Permission created successfully.'
        ]);
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
    public function update(Request $request, Permission $permission)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
        ]);

        $data = $request->only(['name']);

        $permission->update($data);
        
        // Return JSON response for better frontend handling
        return response()->json([
            'message' => 'Permission updated successfully.'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        $permission->delete();
        
        // Return JSON response for better frontend handling
        return response()->json([
            'message' => 'Permission deleted successfully.'
        ]);
    }
}