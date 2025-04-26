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
    private $imageCategories = [
        'clothing', 'fashion', 'tshirt', 'jeans', 
        'jacket', 'sweater', 'sportswear'
    ];

    public function run(): void
    {
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
        ]);

        // Limpiar directorio de imágenes si existe
        if (Storage::disk('public')->exists('images/products')) {
            Storage::disk('public')->deleteDirectory('images/products');
        }

        // Crear directorio para imágenes
        Storage::disk('public')->makeDirectory('images/products');

        // Crear categorías
        $categories = Category::factory(10)->create();
        
        // Crear marcas
        $brands = collect([
            ['name' => 'Upp Streetwear', 'description' => 'Ropa urbana con estilo universitario.'],
            ['name' => 'UppFit', 'description' => 'Prendas deportivas cómodas y resistentes.'],
            ['name' => 'Ingenium', 'description' => 'Moda casual para estudiantes de ingeniería.'],
            ['name' => 'MedStyle', 'description' => 'Uniformes y ropa casual para medicina.'],
            ['name' => 'BioTrend', 'description' => 'Ropa fresca para estudiantes de biomedicina.'],
            ['name' => 'FisioWear', 'description' => 'Estilo activo para fisioterapeutas en formación.'],
            ['name' => 'Classic UPP', 'description' => 'Diseños clásicos con el logo institucional.'],
        ])->map(function ($brand) {
            return Brand::create($brand);
        });

        // Nombres de productos
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
            'Polo Bordado Ingeniería',
            'Suéter Casual Medicina',
            'Hoodie Ingenium Azul Marino',
            'Playera DryFit Biomedicina',
            'Chaleco Deportivo FisioWear',
            'Sudadera Oversize UPP',
            'Playera Roja con Logo UPP',
            'Suéter Azul Marino Ingeniería',
            'Pantalón Casual MedStyle',
            'Playera Blanca FisioWear',
        ];

        // Colores disponibles
        $colors = [
            'Rojo', 'Azul marino', 'Amarillo', 'Blanco', 'Negro', 
            'Gris claro', 'Gris oscuro', 'Verde', 'Naranja', 'Púrpura',
            'Beige', 'Marrón', 'Rosa', 'Turquesa'
        ];

        // Crear productos con imágenes
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

            // Crear imágenes reales para el producto (1-3 imágenes por producto)
            $this->downloadAndAttachProductImages($product, rand(1, 3));
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
            "Producto resistente y de alta calidad, diseñado para durar toda la carrera.",
            "Articulo con tecnología de secado rápido y tejido transpirable para mayor comodidad.",
        ];

        $baseDescription = $descriptions[rand(0, count($descriptions) - 1)];
        
        $additionalDetails = " Este producto cuenta con costuras reforzadas, etiqueta suave para mayor comodidad y diseño ergonómico. Material: " . 
                            ["algodón 100%", "poliéster 80%/algodón 20%", "algodón orgánico", "mezcla de algodón y spandex para mayor elasticidad"][rand(0, 3)] . ".";
        
        return $baseDescription . $additionalDetails;
    }

    protected function downloadAndAttachProductImages(Product $product, int $count): void
    {
        for ($i = 0; $i < $count; $i++) {
            try {
                // Seleccionar una categoría aleatoria de imágenes
                $category = $this->imageCategories[array_rand($this->imageCategories)];
                
                // Descargar imagen de Lorem Picsum (servicio gratuito)
                $imageUrl = "https://picsum.photos/800/800?random=" . rand(1, 1000) . "&category=$category";
                
                // O usar Unsplash (requiere API key si haces muchas peticiones)
                // $imageUrl = "https://source.unsplash.com/random/800x800/?$category";
                
                $imageData = Http::get($imageUrl)->body();
                
                // Generar nombre único para la imagen
                $imageName = 'product-' . $product->id . '-' . Str::random(10) . '.jpg';
                $imagePath = "images/products/$imageName";
                
                // Guardar imagen en el storage
                Storage::disk('public')->put($imagePath, $imageData);
                
                // Crear registro en la base de datos
                Image::create([
                    'url' => $imagePath,
                    'imageable_type' => Product::class,
                    'imageable_id' => $product->id,
                ]);
                
            } catch (\Exception $e) {
                // En caso de error, continuar con el siguiente producto
                continue;
            }
        }
    }
}