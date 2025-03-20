<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\Image;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Cart;
use Database\Factories\CartFactory;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear 10 Roles
        $roles = Role::factory(10)->create();

        // Crear 10 Usuarios y asignar roles aleatorios
        $users = User::factory(10)->create()->each(function ($user) use ($roles) {
            // Asignar entre 1 y 3 roles a cada usuario
            $user->roles()->attach(
                $roles->random(rand(1, 3))->pluck('id')->toArray()
            );
        });

        // Crear 10 Categorías y 10 Marcas
        Category::factory(10)->create();
        Brand::factory(10)->create();

        // Crear 50 Productos, cada uno con 3 imágenes
        $products = Product::factory(50)
            ->has(Image::factory()->count(3))
            ->create();

        // Crear carritos para cada usuario y agregar productos
        $users->each(function ($user) use ($products) {
            // Crear un carrito para el usuario
            $cart = CartFactory::new()->create(['user_id' => $user->id]);

            // Agregar entre 1 y 5 productos al carrito
            $cart->products()->attach(
                $products->random(rand(1, 10))->pluck('id')->mapWithKeys(function ($productId) {
                    return [$productId => ['quantity' => rand(1, 5)]];
                })
            );
        });
    }
}
