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
use Illuminate\Support\Facades\Log;

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
        $search = $request->input('search');

        // Obtener todas las categorías con sus relaciones
        $query = Category::with(['parent', 'image', 'children.image'])
            ->when($search, function($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            });

        $allCategories = $query->get()
            ->map(function ($category) {
                // Añadir nivel de anidación
                $category->level = $this->calculateCategoryLevel($category);
                return $category;
            });

        return Inertia::render('Category/Index', [
            'categories' => $allCategories,
            'filters' => $request->only(['search']),
            'can' => [
                'category_edit' => $request->user()?->can('category-edit'),
                'category_delete' => $request->user()?->can('category-delete'),
                'category_create' => $request->user()?->can('category-create'),
            ],
        ]);
    }

    // Método auxiliar para calcular el nivel de anidación
    private function calculateCategoryLevel($category, $level = 0)
    {
        if (!$category->parent) return $level;
        return $this->calculateCategoryLevel($category->parent, $level + 1);
    }

    public function create(Request $request)
    {
        if ($request->session()->get('recently_created')) {
            return redirect()
                ->route('category.index')
                ->with('info', 'Ya creaste una categoría. Usa el botón "Nueva categoría" si deseas crear otra.');
        }

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
            $path = $image->store('images/categories', 'public');
            $category->image()->create(['url' => $path]);
        }

        return redirect()
            ->route('category.index')
            ->with('success', "¡La categoría fue creada correctamente!")
            ->with('recently_created', true);
    }

    public function show($id)
    {
        $category = Category::with(['image', 'parent', 'children.image'])->find($id);

        if (!$category) {
            return redirect()
                ->route('category.index')
                ->with('error', 'La categoría que intentas ver ya no existe.')
                ->withHeaders([
                    'Cache-Control' => 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
                    'Pragma' => 'no-cache',
                    'Expires' => '0'
                ]);
        }

        return Inertia::render('Category/Show', [
            'category' => $category
        ]);
    }

    public function edit($id)
    {
        $category = Category::with('image')->find($id);

        if (!$category) {
            return redirect()
                ->route('category.index')
                ->with('error', 'La categoría que intentas editar ya no existe.')
                ->withHeaders([
                    'Cache-Control' => 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
                    'Pragma' => 'no-cache',
                    'Expires' => '0'
                ]);
        }

        // Obtener todas las categorías excepto la actual y sus descendientes
        $excludeIds = $this->getCategoryAndDescendantsIds($category);
        
        $categories = Category::with(['image', 'children.image'])
            ->whereNotIn('id', $excludeIds)
            ->get();

        return Inertia::render('Category/Edit', [
            'category' => $category,
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

        if ($request->boolean('deleted_image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image->url);
                $category->image()->delete();
            }
        }

        if ($request->hasFile('image')) {
            // Eliminar imagen anterior si existe
            if ($category->image) {
                Storage::disk('public')->delete($category->image->url);
                $category->image()->delete();
            }

            $image = $request->file('image');
            $path = $image->store('images/categories', 'public');
            $category->image()->create(['url' => $path]);
        }

        return redirect()
            ->route('category.index')
            ->with('success', '¡Categoría actualizada exitosamente!');
    }

    public function confirmDelete($categoryId)
    {
        $category = Category::with('children')->findOrFail($categoryId);
        
        // Verificar si tiene subcategorías
        if ($category->children->count() > 0) {
            return response()->json([
                'error' => 'Esta categoría tiene subcategorías asociadas. Elimine primero las subcategorías.',
                'has_children' => true
            ], 422);
        }

        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        // Verificación adicional por si acaso
        if ($category->children()->count() > 0) {
            return redirect()
                ->route('category.index')
                ->with('error', 'No se puede eliminar una categoría que tiene subcategorías.')
                ->withHeaders([
                    'Cache-Control' => 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
                    'Pragma' => 'no-cache',
                    'Expires' => '0'
                ]);
        }

        if ($category->image) {
            Storage::disk('public')->delete($category->image->url);
            $category->image()->delete();
        }

        $category->delete();

        return redirect()
            ->route('category.index', ['nocache' => time()])
            ->with('success', '¡Categoría eliminada exitosamente!')
            ->withHeaders([
                'Cache-Control' => 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
                'Pragma' => 'no-cache',
                'Expires' => '0'
            ]);
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