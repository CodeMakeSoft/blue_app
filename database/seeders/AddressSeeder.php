<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('countries')->insert([
            'id' => 484,
            'name' => 'México',
        ]);
        DB::table('states')->insert([
            'id' => 13,
            'name' => 'Hidalgo',
            'country_id' => 484,
        ]);
        DB::table('municipalities')->insert([
            'id' => 48,
            'name' => 'Pachuca de Soto',
            'state_id' => 13,
        ]);
        DB::table('cities')->insert([
            'id' => 3,
            'name' => 'Pachuca de Soto',
            'municipality_id' => 48,
        ]);

        $districts = [
            ['id' => 1, 'name' => 'Centro', 'postal_code' => '42000'],
            ['id' => 2258, 'name' => 'La Granada', 'postal_code' => '42004'],
            ['id' => 6, 'name' => 'La Alcantarilla', 'postal_code' => '42010'],
            ['id' => 8, 'name' => 'El Arbolito', 'postal_code' => '42010'],
            ['id' => 9, 'name' => 'El Atorón', 'postal_code' => '42010'],
            ['id' => 13, 'name' => 'La Palma', 'postal_code' => '42010'],
            ['id' => 16, 'name' => 'San Juan Pachuca', 'postal_code' => '42010'],
            ['id' => 18, 'name' => 'Nueva Estrella', 'postal_code' => '42014'],
            ['id' => 20, 'name' => 'Asta Bandera', 'postal_code' => '42015'],
            ['id' => 21, 'name' => 'El Porvenir', 'postal_code' => '42015'],
            ['id' => 22, 'name' => 'La Cruz', 'postal_code' => '42015'],
            ['id' => 24, 'name' => 'San Nicolás', 'postal_code' => '42018'],
            ['id' => 2266, 'name' => 'Julián Carrillo', 'postal_code' => '42018'],
            ['id' => 2268, 'name' => 'La Españita', 'postal_code' => '42018'],
            ['id' => 26, 'name' => 'Cuauhtémoc', 'postal_code' => '42020'],
            ['id' => 28, 'name' => 'José López Portillo', 'postal_code' => '42020'],
            ['id' => 31, 'name' => 'Pachuca 88', 'postal_code' => '42020'],
            ['id' => 32, 'name' => 'Real de Medinas', 'postal_code' => '42020'],
            ['id' => 6136, 'name' => 'Prosperidad', 'postal_code' => '42020'],
            ['id' => 33, 'name' => 'Lomas de Vista Hermosa', 'postal_code' => '42026'],
        ];

        foreach ($districts as $district) {
            DB::table('districts')->insert([
                'id' => $district['id'],
                'name' => $district['name'],
                'postal_code' => $district['postal_code'],
                'city_id' => 3, 
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}