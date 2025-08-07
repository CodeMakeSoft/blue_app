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
        $SuperAdminPermissions = Permission::all(); // Admin tiene todos los permisos

        $adminPermissions = [
            'user-view',
            'user-create',
            'user-edit',
            'user-delete',
            "category-view",
            "category-create",
            "category-edit",
            "category-delete",
            'brand-view',
            'brand-create',    
            'brand-edit',
            'brand-delete',
            'product-view',
            'product-create',  
            'product-edit',
            'product-delete',
            'can-access-admin-panel',
        ];

        $sellerPermissions = [
            'product-view',
            'product-create',  
            'product-edit',
            'product-delete',
            'can-access-admin-panel',
        ];
        
        // Crear roles y asignar permisos
        $SuperAdmin = Role::firstOrCreate(['name' => 'SuperAdmin']);
        $SuperAdmin->syncPermissions($SuperAdminPermissions);
        
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $admin->syncPermissions($adminPermissions);

        $seller = Role::firstOrCreate(['name' => 'Seller']);
        $seller->syncPermissions($sellerPermissions);
    }
}
