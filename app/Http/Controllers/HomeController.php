<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeController extends Controller
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

    public function welcome()   
    {
        $products = Product::with('images')->take(6)->get();
        $products->each(function ($product) {
            $product->image = $this->getImageUrl($product, 'images');
        });

        $brands = Brand::with('image')->take(5)->get();
        $brands->each(function ($brand) {
            $brand->image_url = $this->getImageUrl($brand);
        });

        $categories = Category::with('image')->take(5)->get();
        $categories->each(function ($category) {
            $category->image_url = $this->getImageUrl($category);
        });

        return Inertia::render('Welcome', [
            'products' => $products,
            'brands' => $brands,
            'categories' => $categories,
        ]);
    }
}
