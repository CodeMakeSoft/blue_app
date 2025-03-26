<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Brand\StoreRequest;
use App\Http\Requests\Brand\UpdateRequest;
use Inertia\Response;
use App\Http\Controllers\Storage;


class BrandController extends Controller
{
    
    public function index(): Response 
    {
    $brands = Brand::with('images')->get(); // Cargar las imágenes relacionadas
    return Inertia::render('Brand/Index', [
        'brands' => $brands,
    ]);
}

    
    public function create()
    {
        return Inertia::render('Brand/Create');
    }

   
    public function store(StoreRequest $request)
    {
        $validated = $request->validated();

        $brand = Brand::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

         if ($request->hasFile('new_images')) {
        foreach ($request->file('new_images') as $image) {
            $path = $image->store('images', 'public');
            $brand->images()->create([
                'url' => $path,
            ]);
        }
    }

        return redirect()->route('brand.index')->with('success', 'Brand created successfully.');
    }

   
    public function show(Brand $brand)
    {
        //
    }

    
    public function edit(Brand $brand)
    {
         return Inertia::render('Brand/Edit', compact('brand'));
    }

    
    public function update(UpdateRequest $request, Brand $brand)
    {
        $validated = $request->validated();

       $brand->update([
        'name' => $validated['name'],
        'description' => $validated['description'],
    ]);

        $brand->images()->delete();
    
    if ($request->hasFile('new_images')) {
        foreach ($request->file('new_images') as $image) {
            $path = $image->store('images', 'public'); // Almacena la imagen en storage/app/public/images
            $brand->images()->create(['url' => $path]); // Crea un registro en la tabla `images`
        }
    }


    return redirect()->route('brand.index')->with('success', 'Marca actualizada correctamente');
}


    public function confirmDelete($brandId)
    {
        $brand = Brand::findOrFail($brandId);
         return response()->json($brand);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
    $brand->images()->delete(); 
    $brand->delete(); 

        return redirect()->route('brand.index')->with('success', 'Marca eliminada con éxito.');
    }
    public function catalog()
    {
        $brands = Brand::with('images')->get(); // Asegúrate de cargar las imágenes
        return Inertia::render('Brand/Catalog', [
            'brands' => $brands
        ]);
    }
}