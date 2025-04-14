<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function welcome()   
    {
        $products = Product::with('images')->take(6)->get();
        foreach ($products as $product) {
            $product->image = $product->images->isNotEmpty()
                ? asset('storage/' . $product->images[0]->url)
                : 'https://via.placeholder.com/150';
        }

        $brands = Brand::with('image')->take(5)->get();
        foreach ($brands as $brand) {
            $brand->image_url = $brand->image
                ? asset('storage/' . $brand->image->url)
                : 'https://via.placeholder.com/150';
        }

        $categories = Category::with('image')->take(5)->get();
        foreach ($categories as $cat) {
            $cat->image_url = $cat->image
                ? asset('storage/' . $cat->image->url)
                : 'https://via.placeholder.com/150';
        }

        return Inertia::render('Welcome', [
            'products' => $products,
            'brands' => $brands,
            'categories' => $categories,
        ]);
    }
}
