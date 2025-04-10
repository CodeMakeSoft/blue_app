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
            //Admin
            'can-access-admin-panel',
        ];
        foreach($permissions as $key => $permission){
            Permission::create(['name' => $permission]);
        }
    }
}
