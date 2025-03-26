<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Category\StoreRequest;
use App\Http\Requests\Category\UpdateRequest;
use Inertia\Response;
use App\Http\Controllers\Storage;


class CategoryController extends Controller
{
    
    public function index(): Response 
    {
    $categories = Category::with('images')->get(); // Cargar las imágenes relacionadas
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

         if ($request->hasFile('new_images')) {
        foreach ($request->file('new_images') as $image) {
            $path = $image->store('images', 'public');
            $category->images()->create([
                'url' => $path,
            ]);
        }
    }

        return redirect()->route('category.index')->with('success', 'Category created successfully.');
    }

   
    public function show(Category $category)
    {
        //
    }

    
    public function edit(Category $category)
    {
         return Inertia::render('Category/Edit', compact('category'));
    }

    
    public function update(UpdateRequest $request, Category $category)
    {
        $validated = $request->validated();

       $category->update([
        'name' => $validated['name'],
        'description' => $validated['description'],
    ]);

        $category->images()->delete();
    
    if ($request->hasFile('new_images')) {
        foreach ($request->file('new_images') as $image) {
            $path = $image->store('images', 'public'); // Almacena la imagen en storage/app/public/images
            $category->images()->create(['url' => $path]); // Crea un registro en la tabla `images`
        }
    }


    return redirect()->route('category.index')->with('success', 'Categoría actualizada correctamente');
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
    $category->images()->delete(); 
    $category->delete(); 

        return redirect()->route('category.index')->with('success', 'Categoría eliminada con éxito.');
    }
}

