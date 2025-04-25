<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Category\StoreRequest;
use App\Http\Requests\Category\UpdateRequest;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;


class CategoryController extends Controller
{
    
    public function index(): Response 
    {
        $categories = Category::with('image')->get(); 
        return Inertia::render('Category/Index', [
            'categories' => $categories,
        ]);
    }

    
    public function create()
    {
        return Inertia::render('Category/Create');
    }

   
    public function store(StoreRequest $request)
    {
        $validated = $request->validated();

        $category = Category::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $path = $image->store('images', 'public');
            $category->image()->create(['url' => $path]);
        }

        return redirect()->route('category.index')->with('success', 'Categoría creada exitosamente.');
    }

   
 public function show(Category $category)
    {
        return Inertia::render('Category/Show', [
            'category' => $category->load('image')
        ]);
    }

 public function edit(Category $category)
    {
        return Inertia::render('Category/Edit', [
            'category' => $category->load('image')
        ]);
    }
    

    
   public function update(UpdateRequest $request, Category $category)
    {
        $category->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        // Eliminar imagen existente si se solicitó
        if ($request->deleted_image) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image->url);
                $category->image()->delete();
            }
        }

        // Agregar nueva imagen si se proporcionó
        if ($request->hasFile('image')) {
            // Eliminar imagen anterior si existe
            if ($category->image) {
                Storage::disk('public')->delete($category->image->url);
                $category->image()->delete();
            }
            
            $image = $request->file('image');
            $path = $image->store('images', 'public');
            $category->image()->create(['url' => $path]);
        }

        return redirect()->route('category.index');
    }


    public function confirmDelete($categoryId)
    {
        $category = Category::findOrFail($categoryId);
         return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if ($category->image) {
            Storage::disk('public')->delete($category->image->url);
            $category->image()->delete();
        }
        $category->delete();

        return redirect()->route('category.index')->with('success', 'Categoría eliminada con éxito.');
    }

    public function catalog()
    { 
        $categories = Category::with('image')->get();
        return Inertia::render('Category/Catalog', [
            'categories' => $categories 
        ]);
    }
}