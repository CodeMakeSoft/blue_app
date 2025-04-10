<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminPermissions = Permission::all(); // Admin tiene todos los permisos

        $managerPermissions = [
            'user-view',
            'user-edit',
            'permission-view',
            'permission-edit',
            'role-view',
            'role-edit',
            'category-view',
            'category-edit',
            'brand-view',
            'brand-edit',
            'product-view',
            'product-edit',
            'can-access-admin-panel',
        ];

        // Crear roles y asignar permisos
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $admin->syncPermissions($adminPermissions);

        $manager = Role::firstOrCreate(['name' => 'Manager']);
        $manager->syncPermissions($managerPermissions);
    }
}
