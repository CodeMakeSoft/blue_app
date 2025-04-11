<?php

namespace Database\Seeders;


use App\Models\Brand;
use App\Models\Product;
use App\Models\Category;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            AddressSeeder::class,
        ]);

        Category::factory(10)->create();
        Brand::factory(10)->create();
        Product::factory(10)->create();
    }
}
