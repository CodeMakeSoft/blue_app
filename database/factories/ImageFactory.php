<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Image;
use App\Models\Product;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    // Associated model
    protected $model  = Image::class;

    public function definition(): array
    {
        return [
            // 'url' => 'https://picsum.photos/640/480', 
            // // Id for related model
            // 'imageable_id' => Product::factory(),
            // // Stores the name of the model class
            // 'imageable_type' => Product::class, 
            'url' => 'https://picsum.photos/1024/1024?random=' . $this->faker->unique()->numberBetween(1, 1000),
        ];
    }
}
