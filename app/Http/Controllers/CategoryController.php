<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Category\StoreRequest;
use App\Http\Requests\Category\UpdateRequest;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;

class CategoryController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:category-view', only: ['index']),
            new Middleware('permission:category-create', only: ['store']),
            new Middleware('permission:category-edit', only: ['update']),
            new Middleware('permission:category-delete', only: ['destroy']),
        ];
    }
    
    public function index(Request $request): Response 
    {
        // Obtener todas las categorías con sus relaciones
        $allCategories = Category::with(['parent', 'image', 'children.image'])
            ->get()
            ->map(function ($category) {
                // Añadir nivel de anidación
                $category->level = $this->calculateCategoryLevel($category);
                return $category;
            });
        
        return Inertia::render('Category/Index', [
            'categories' => $allCategories,
            'can' => [
                'category_edit' => $request->user()?->can('category-edit') ?? false,
                'category_delete' => $request->user()?->can('category-delete') ?? false,
                'category_create' => $request->user()?->can('category-create') ?? false,
            ],
        ]);
    }

    // Método auxiliar para calcular el nivel de anidación
    private function calculateCategoryLevel($category, $level = 0)
    {
        if (!$category->parent) return $level;
        return $this->calculateCategoryLevel($category->parent, $level + 1);
    }
    
    public function create()
    {
        $categories = Category::with(['image', 'children.image'])
            ->whereNull('parent_id')
            ->get();
            
        return Inertia::render('Category/Create', [
            'categories' => $categories
        ]);
    }

    public function store(StoreRequest $request)
    {
        $validated = $request->validated();

        $category = Category::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'parent_id' => $validated['parent_id'] ?? null
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
            'category' => $category->load(['image', 'parent', 'children.image'])
        ]);
    }

    public function edit(Category $category)
    {
        // Obtener todas las categorías excepto la actual y sus descendientes
        $excludeIds = $this->getCategoryAndDescendantsIds($category);
        
        $categories = Category::with(['image', 'children.image'])
            ->whereNotIn('id', $excludeIds)
            ->get();
            
        return Inertia::render('Category/Edit', [
            'category' => $category->load('image'),
            'categories' => $categories
        ]);
    }

    // Método auxiliar para obtener IDs de categoría y sus descendientes
    private function getCategoryAndDescendantsIds($category)
    {
        $ids = [$category->id];
        foreach ($category->children as $child) {
            $ids = array_merge($ids, $this->getCategoryAndDescendantsIds($child));
        }
        return $ids;
    }
    
    public function update(UpdateRequest $request, Category $category)
    {
        $category->update([
            'name' => $request->name,
            'description' => $request->description,
            'parent_id' => $request->parent_id
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

        return redirect()->route('category.index')->with('success', 'Categoría actualizada exitosamente.');
    }

    public function confirmDelete($categoryId)
    {
        $category = Category::findOrFail($categoryId);
        return response()->json($category);
    }

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
        $categories = Category::with(['image', 'children.image'])
            ->whereNull('parent_id')
            ->get();
            
        return Inertia::render('Category/Catalog', [
            'categories' => $categories 
        ]);
    }

    public function products(Category $category)
    {
        return Inertia::render('Category/Partials/Products', [
            'category' => $category->load(['image', 'children.image']),
            'products' => $category->products()
                ->with(['images', 'category', 'brand'])
                ->paginate(12)
        ]);
    }
}