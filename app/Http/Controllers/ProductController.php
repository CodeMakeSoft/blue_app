<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Brand;
use App\Models\Image;
use Inertia\Response;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Products\StoreRequest;
use App\Http\Requests\Products\UpdateRequest;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Routing\Controllers\HasMiddleware;

class ProductController extends Controller implements HasMiddleware
{
    
    public static function middleware(): array
    {
        return [
            new Middleware('role:SuperAdmin|Admin|Seller'),
            new Middleware('permission:product-view', only: ['index']),
            new Middleware('permission:product-create', only: ['store']),
            new Middleware('permission:product-edit', only: ['update']),
            new Middleware('permission:product-delete', only: ['destroy']),
        ];
    }
    /**
     * Display a listing of the products.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Construir la consulta base
        $query = Product::with(['images', 'category', 'brand']);
        
        // Si el usuario es vendedor (y no admin), filtrar solo sus productos
        if ($user->hasRole('Seller') && !$user->hasRole('Admin')) {
            $query->where('user_id', $user->id);
        }
        
        $products = $query->get();
        
        return Inertia::render('Products/Index', [
            'products' => $products,
            'can' => [
                'product_edit' => $user->can('product-edit'),
                'product_delete' => $user->can('product-delete'),
                'product_create' => $user->can('product-create'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::all(['id', 'name']),
            'brands' => Brand::all(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(StoreRequest $request)
    {
        $validated = $request->validated();
        $validated['user_id'] = Auth::id(); 
        
        $product = Product::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create(['url' => $path]);
            }
        }

        return redirect()->route('products.index')
            ->with('success', 'Producto creado correctamente.');
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        $user = request()->user();
        
        if ($user->hasRole('Seller') && !$user->hasRole('Admin') && $product->user_id !== $user->id) {
            abort(403, 'No tienes permisos para editar este producto.');
        }

        return Inertia::render('Products/Edit', [
            'product' => $product->load(['images', 'category', 'brand']),
            'categories' => Category::all(['id', 'name']),
            'brands' => Brand::all(['id', 'name']),
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(UpdateRequest $request, Product $product)
    {
        $user = request()->user();
        
        if ($user->hasRole('Seller') && !$user->hasRole('Admin') && $product->user_id !== $user->id) {
            abort(403, 'No tienes permisos para editar este producto.');
        }
        
        $product->update($request->validated());

        // Eliminar imágenes seleccionadas
        if ($request->deleted_images) {
            $imagesToDelete = $product->images()
                ->whereIn('id', $request->deleted_images)
                ->get();

            foreach ($imagesToDelete as $image) {
                Storage::disk('public')->delete($image->url);
                $image->delete();
            }
        }

        // Añadir nuevas imágenes
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $product->images()->create(['url' => $path]);
            }
        }

        return redirect()->route('products.index')
            ->with('success', 'Producto actualizado correctamente.');
    }

    /**
     * Display confirmation for product deletion.
     */
    public function confirmDelete($productId)
    {
        $product = Product::with('images')->findOrFail($productId);
        return response()->json($product);
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product)
    {

        $user = request()->user();
        
        if ($user->hasRole('Seller') && !$user->hasRole('Admin') && $product->user_id !== $user->id) {
            abort(403, 'No tienes permisos para eliminar este producto.');
        }

        // Eliminar imágenes asociadas
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->url);
            $image->delete();
        }
        
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Producto eliminado correctamente.');
    }

public function show($id)
{
    $product = Product::with('images')->findOrFail($id);

    // Añadir una imagen principal para mostrar fácilmente
    if ($product->images->isNotEmpty()) {
        $product->image = asset('storage/' . $product->images[0]->url);
    } else {
        $product->image = 'https://via.placeholder.com/150';
    }

    return Inertia::render('Products/Show', [
        'product' => [
            'id' => $product->id,
            'name' => $product->name,
            'price' => $product->price,
            'description' => $product->description,
            'stock' => $product->stock,
            'deliveryTime' => $product->delivery_time,
            'image' => $product->image,
        ],
    ]);
}


public function view()
{
    $products = Product::all(); // Puedes paginar si quieres

    $products = Product::with('images')->get(); // 👈 Esto carga las imágenes

    // Agregar una propiedad 'image' para facilitar el acceso desde React
    foreach ($products as $product) {
        if ($product->images->isNotEmpty()) {
            $product->image = asset('storage/' . $product->images[0]->url); // solo la primera imagen
        } else {
            $product->image = 'https://via.placeholder.com/150'; // imagen por defecto
        }
    }

    return Inertia::render('Products/Products', [
        'products' => $products,
    ]);
}
}



