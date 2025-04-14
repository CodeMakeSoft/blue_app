<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;

class DashboardController extends Controller
{
   // DashboardController.php
    public function index(Request $request)
    {
        $search = $request->input('search');

        $products = Product::when($search, fn($q) => 
            $q->where('name', 'like', "%{$search}%")
        )->paginate(5)->withQueryString();

        $brands = Brand::when($search, fn($q) => 
            $q->where('name', 'like', "%{$search}%")
        )->paginate(5)->withQueryString();

        $categories = Category::when($search, fn($q) => 
            $q->where('name', 'like', "%{$search}%")
        )->paginate(5)->withQueryString();

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
