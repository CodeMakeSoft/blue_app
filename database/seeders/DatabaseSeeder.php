<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\Image;

use App\Models\Brand;
use App\Models\Product;
use App\Models\Cart;
use Database\Factories\CartFactory;

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

        // Crear 10 Categorías y 10 Marcas
        Category::factory(10)->create();
        Brand::factory(10)->create();

    }
}
