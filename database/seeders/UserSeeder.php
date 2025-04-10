<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Database\Factories\CartFactory;
use App\Models\Product;
use App\Models\Image;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'], // Evita duplicados
            [
                'name' => 'Admin',
                'password' => Hash::make('password'), // Contraseña por defecto (cámbiala en producción)
            ]
        );

        // Asignar rol 'Admin' (usando el nombre exacto del rol creado en RoleSeeder)
        $adminRole = Role::where('name', 'Admin')->first();
        $admin->assignRole($adminRole);

        $users = User::factory(10)->create(); // Crear 10 usuarios aleatorios
        // Crear 50 Productos, cada uno con 3 imágenes
        $products = Product::factory(50)
        //->has(Image::factory()->count(3))
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
