<?php

namespace App\Http\Controllers;

use App\Http\Requests\Products\StoreRequest;
use App\Http\Requests\Products\UpdateRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Image;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(): Response
    {
        return Inertia::render('Products/Index', [
            'products' => Product::with(['images', 'category', 'brand'])->get()
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
        $product = Product::create($request->validated());

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


public function index2()
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

    return Inertia::render('Products/Index2', [
        'products' => $products,
    ]);
}
}



