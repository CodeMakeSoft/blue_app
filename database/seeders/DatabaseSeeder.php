<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Image;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    // Palabras clave para imágenes de productos
    private $productImageCategories = [
        'clothing', 'fashion', 'tshirt', 'jeans', 
        'jacket', 'sweater', 'sportswear'
    ];
    
    // Palabras clave para imágenes de marcas
    private $brandImageKeywords = [
        'logo', 'brand', 'design', 'label', 
        'badge', 'emblem', 'symbol'
    ];
    
    // Palabras clave para imágenes de categorías
    private $categoryImageKeywords = [
        'apparel', 'clothing', 'fashion', 'wardrobe',
        'garment', 'outfit', 'attire'
    ];

    public function run(): void
    {
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
        ]);

        // Limpiar y crear directorios de imágenes
        $this->prepareImageDirectories();

        // Crear categorías con imágenes
        $categories = Category::factory(10)->create()->each(function ($category) {
            $this->downloadAndAttachImage(
                $category,
                'categories',
                $this->categoryImageKeywords[array_rand($this->categoryImageKeywords)]
            );
        });
        
        // Crear marcas con imágenes
        $brands = collect([
            ['name' => 'Upp Streetwear', 'description' => 'Ropa urbana con estilo universitario.'],
            ['name' => 'UppFit', 'description' => 'Prendas deportivas cómodas y resistentes.'],
            ['name' => 'Ingenium', 'description' => 'Moda casual para estudiantes de ingeniería.'],
            ['name' => 'MedStyle', 'description' => 'Uniformes y ropa casual para medicina.'],
            ['name' => 'BioTrend', 'description' => 'Ropa fresca para estudiantes de biomedicina.'],
            ['name' => 'FisioWear', 'description' => 'Estilo activo para fisioterapeutas en formación.'],
            ['name' => 'Classic UPP', 'description' => 'Diseños clásicos con el logo institucional.'],
        ])->map(function ($brandData) {
            $brand = Brand::create($brandData);
            
            $this->downloadAndAttachImage(
                $brand,
                'brands',
                $this->brandImageKeywords[array_rand($this->brandImageKeywords)]
            );
            
            return $brand;
        });

        // Crear productos con imágenes
        $productNames = [
            'Playera UPP Ingenieria en Software',
            'Sudadera UPP Medicina',
            'Pantalón Deportivo Biomedicina',
            'Playera Manga Larga Fisioterapia',
            'Suéter Clásico UPP',
            'Jogger UppFit Negro',
            'Sudadera BioTrend Azul',
            'Playera Blanca Ingeniería',
            'Chamarra MedStyle',
            'Playera UPP Negra Fisioterapia',
        ];

        $colors = ['Rojo', 'Azul marino', 'Amarillo', 'Blanco', 'Negro', 'Gris claro', 'Gris oscuro'];

        foreach ($productNames as $name) {
            $product = Product::create([
                'name' => $name,
                'description' => $this->generateProductDescription($name),
                'price' => rand(150, 500) + (rand(0, 99) / 100),
                'stock' => rand(10, 50),
                'size' => ['S', 'M', 'L', 'XL'][rand(0, 3)],
                'color' => $colors[rand(0, count($colors) - 1)],
                'status' => rand(0, 1),
                'availability' => now()->addDays(rand(0, 30)),
                'category_id' => $categories->random()->id,
                'brand_id' => $brands->random()->id,
            ]);

            // 1-3 imágenes por producto
            $this->downloadAndAttachImage(
                $product,
                'products',
                $this->productImageCategories[array_rand($this->productImageCategories)],
                rand(1, 3)
            );
        }
    }

    protected function prepareImageDirectories(): void
    {
        $directories = ['products', 'brands', 'categories'];
        
        foreach ($directories as $dir) {
            if (Storage::disk('public')->exists("images/$dir")) {
                Storage::disk('public')->deleteDirectory("images/$dir");
            }
            Storage::disk('public')->makeDirectory("images/$dir");
        }
    }

    protected function generateProductDescription(string $productName): string
    {
        $descriptions = [
            "Producto oficial de la tienda UPP, confeccionado con materiales de alta calidad.",
            "Prenda diseñada especialmente para estudiantes universitarios, con gran durabilidad.",
            "Articulo de edición limitada, ideal para mostrar tu orgullo universitario.",
            "Diseño exclusivo creado por nuestros diseñadores, con los mejores materiales.",
            "Prenda cómoda y elegante, perfecta para el día a día en la universidad.",
        ];

        $baseDescription = $descriptions[rand(0, count($descriptions) - 1)];
        
        $additionalDetails = " Este producto cuenta con costuras reforzadas, etiqueta suave para mayor comodidad y diseño ergonómico. Material: " . 
                            ["algodón 100%", "poliéster 80%/algodón 20%", "algodón orgánico"][rand(0, 2)] . ".";
        
        return $baseDescription . $additionalDetails;
    }

    protected function downloadAndAttachImage($model, string $directory, string $keyword, int $count = 1): void
    {
        for ($i = 0; $i < $count; $i++) {
            try {
                // Usar Lorem Picsum para imágenes aleatorias
                $imageUrl = "https://picsum.photos/800/800?random=" . rand(1, 1000) . "&$keyword";
                
                $imageData = Http::timeout(30)->get($imageUrl)->body();
                
                $imageName = Str::slug(class_basename($model)) . '-' . $model->id . '-' . Str::random(5) . '.jpg';
                $imagePath = "images/$directory/$imageName";
                
                Storage::disk('public')->put($imagePath, $imageData);
                
                Image::create([
                    'url' => $imagePath,
                    'imageable_type' => get_class($model),
                    'imageable_id' => $model->id,
                ]);
                
            } catch (\Exception $e) {
                continue;
            }
        }
    }
}