<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 10 Roles
        $roles = Role::factory(10)->create();

        // Create 10 Users and assign random roles to each user
        User::factory(10)->create()->each(function ($user) use ($roles) {
            // Assign 1 to 3 roles to each user
            $user->roles()->attach(
                $roles->random(rand(1, 3))->pluck('id')->toArray()
            );
        });
        Product::factory(10)->create();
    }
}
