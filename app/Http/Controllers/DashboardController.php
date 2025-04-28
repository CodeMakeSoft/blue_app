<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;

class DashboardController extends Controller
{
    private function getImageUrl($model, $imageField = 'image')
    {
        try {
            if ($imageField === 'images') {
                return $model->images->isNotEmpty()
                    ? asset('storage/' . $model->images[0]->url)
                    : 'https://via.placeholder.com/150';
            }
            
            return $model->$imageField && $model->$imageField->url
                ? asset('storage/' . $model->$imageField->url)
                : 'https://via.placeholder.com/150';
        } catch (\Exception $e) {
            \Log::error('Error getting image URL: ' . $e->getMessage());
            return 'https://via.placeholder.com/150';
        }
    }

    public function index(Request $request)
    {
        $search = $request->input('search');

        $products = Product::with(['images', 'brand', 'category'])
            ->when($search, function($query) use ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(8);

        // Obtener IDs de marcas y categorías relacionadas con los productos encontrados
        $relatedBrandIds = $products->pluck('brand_id')->unique();
        $relatedCategoryIds = $products->pluck('category_id')->unique();

        $brands = Brand::with('image')
            ->when($search, function($query) use ($search, $relatedBrandIds) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhereIn('id', $relatedBrandIds);
            })
            ->paginate(5);

        $categories = Category::with('image')
            ->when($search, function($query) use ($search, $relatedCategoryIds) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhereIn('id', $relatedCategoryIds);
            })
            ->paginate(5);

        // Procesar URLs de imágenes
        $products->through(function ($product) {
            $product->image_url = $this->getImageUrl($product, 'images');
            return $product;
        });

        $brands->through(function ($brand) {
            $brand->image_url = $this->getImageUrl($brand);
            return $brand;
        });

        $categories->through(function ($category) {
            $category->image_url = $this->getImageUrl($category);
            return $category;
        });

        return Inertia::render('Dashboard', [
            'products' => $products,
            'brands' => $brands,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
