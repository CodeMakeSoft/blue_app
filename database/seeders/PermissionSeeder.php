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
            "role-view",
            "role-create",
            "role-edit",
            "role-delete",
            "category-view",
            "category-create",
            "category-edit",
            "category-delete",
            'permission-view',
            'permission-create',
            'permission-edit',
            'permission-delete'
        ];
        foreach($permissions as $key => $permission){
            Permission::create(['name' => $permission]);
        }
    }
}
