<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Category\StoreRequest;
use App\Http\Requests\Category\UpdateRequest;

class CategoryController extends Controller
{
    
    public function index()
    {
        $categories = Category::with('images')->get();

        return Inertia::render('Category/Index', [
            'categories' => Category::all()
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

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                
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

        $category->update($validated);

        return redirect()->route('category.index')->with('success', 'Categoría actualizada correctamente');
    }

    public function confirmDelete($categoryId)
    {
        $category = Category::findOrFail($categoryId);
        return Inertia::render('Category/ConfirmDelete',['category' => $category]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('category.index')->with('success', 'Categoría eliminada con éxito.');
    }
}
