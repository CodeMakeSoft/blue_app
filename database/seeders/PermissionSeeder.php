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
            "role-create",
            "role-edit",
            "role-delete",
            "category-create",
            "category-edit",
            "category-delete",
        ];
        foreach($permissions as $key => $permission){
            Permission::create(['name' => $permission]);
        }
    }
}
