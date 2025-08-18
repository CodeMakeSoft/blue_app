<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use App\Singletons\SuperAdmin;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdminRole = Role::firstOrCreate(['name' => 'superAdmin']); // Nota: minúscula consistente
        
        $superAdminRole->users()->detach();

        $superAdminUser = User::firstOrCreate(
            ['email' => 'superadmin@example.com'], // Condición de búsqueda
            [ // Datos para crear si no existe
                'name' => 'SuperAdmin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        SuperAdmin::getInstance()->assignTo($superAdminUser);

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin'); // Nombre de rol en minúscula

        User::factory(20)->create();
    }
}