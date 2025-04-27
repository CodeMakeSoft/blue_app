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
        if ($imageField === 'images') {
            return $model->images->isNotEmpty()
                ? asset('storage/' . $model->images[0]->url)
                : 'https://via.placeholder.com/150';
        }
        
        return $model->$imageField
            ? asset('storage/' . $model->$imageField->url)
            : 'https://via.placeholder.com/150';
    }

    public function index(Request $request)
    {
        $search = $request->input('search');

        $products = Product::with('images')
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
            ->paginate(5)
            ->withQueryString();
        
        $products->getCollection()->each(function ($product) {
            $product->image = $this->getImageUrl($product, 'images');
        });

        $brands = Brand::with('image')
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
            ->paginate(5)
            ->withQueryString();
        
        $brands->getCollection()->each(function ($brand) {
            $brand->image_url = $this->getImageUrl($brand);
        });

        $categories = Category::with('image')
            ->when($search, fn($q) => $q->where('name', 'like', "%{$search}%"))
            ->paginate(5)
            ->withQueryString();
        
        $categories->getCollection()->each(function ($category) {
            $category->image_url = $this->getImageUrl($category);
        });

        return Inertia::render('Dashboard', [
            'products' => $products,
            'brands' => $brands,
            'categories' => $categories,
            'filters' => [
                'search' => $search
            ]
        ]);
    }
}
