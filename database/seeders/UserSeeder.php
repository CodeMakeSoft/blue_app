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

        $users = User::factory(20)->create(); // Crear 10 usuarios aleatorios
        
      
    }
}
