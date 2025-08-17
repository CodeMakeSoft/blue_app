<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            //User 
            'user-view',
            'user-create',
            'user-edit',
            'user-delete',
            //Permissions
            'permission-view',
            'permission-create',
            'permission-edit',
            'permission-delete',
            //Role
            "role-view",
            "role-create",
            "role-edit",
            "role-delete",
            //Category
            "category-view",
            "category-create",
            "category-edit",
            "category-delete",
            //Brand
            'brand-view',
            'brand-create',    
            'brand-edit',
            'brand-delete',
            //Product
            'product-view',
            'product-create',  
            'product-edit',
            'product-delete',
            //Admin, Seller, SuperAdmin
            'can-access-admin-panel',
            'can-manage-roles&permissions',
            //Super Admin
            'admin-view',
            'admin-create',    
            'admin-edit',
            'admin-delete',
        ];
        
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
    }
}
