<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Brand\StoreRequest;
use App\Http\Requests\Brand\UpdateRequest;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
    public function index(): Response 
    {
        $brands = Brand::with('image')->get();
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

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $path = $image->store('images/brands', 'public');
            $brand->image()->create(['url' => $path]);
        }

        return redirect()->route('brand.index')->with('success', 'Marca creada exitosamente.');
    }

    public function show(Brand $brand)
    {
        return Inertia::render('Brand/Show', [
            'brand' => $brand->load('image')
        ]);
    }

    public function edit(Brand $brand)
    {
        return Inertia::render('Brand/Edit', [
            'brand' => $brand->load('image')
        ]);
    }

    public function update(UpdateRequest $request, Brand $brand)
    {
        $brand->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        // Eliminar imagen existente si se solicitó
        if ($request->deleted_image) {
            if ($brand->image) {
                Storage::disk('public')->delete($brand->image->url);
                $brand->image()->delete();
            }
        }

        // Agregar nueva imagen si se proporcionó
        if ($request->hasFile('image')) {
            // Eliminar imagen anterior si existe
            if ($brand->image) {
                Storage::disk('public')->delete($brand->image->url);
                $brand->image()->delete();
            }
            
            $image = $request->file('image');
            $path = $image->store('images/brands', 'public');
            $brand->image()->create(['url' => $path]);
        }

        return redirect()->route('brand.index')->with('success', 'Marca actualizada correctamente');
    }

    public function confirmDelete($brandId)
    {
        $brand = Brand::findOrFail($brandId);
        return response()->json($brand);
    }

    public function destroy(Brand $brand)
    {
        if ($brand->image) {
            Storage::disk('public')->delete($brand->image->url);
            $brand->image()->delete();
        }
        
        $brand->delete();

        return redirect()->route('brand.index')->with('success', 'Marca eliminada con éxito.');
    }

    public function catalog()
    {
        $brands = Brand::with('image')->get();
        return Inertia::render('Brand/Catalog', [
            'brands' => $brands
        ]);
    }
}
