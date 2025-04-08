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
            new Middleware('role:Admin|Manager'),
            new Middleware('permission:category-view', only: ['index', 'show', 'catalog']),
            new Middleware('permission:category-create', only: ['create', 'store']),
            new Middleware('permission:category-edit', only: ['edit', 'update']),
            new Middleware('permission:category-delete', only: ['destroy', 'confirmDelete']),
        ];
    }

    public function index(Request $request): Response
    {
        $categories = Category::with('image')->paginate(10);
        
        return Inertia::render('Admin/Category', [
            'categories' => $categories,
            'activeRoute' => $request->route()->getName(),
            'can' => [
                'category_edit' => $request->user()?->can('category-edit') ?? false,
                'category_delete' => $request->user()?->can('category-delete') ?? false,
                'category_create' => $request->user()?->can('category-create') ?? false,
            ],
        ]);
    }

    public function create(): Response
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

    public function show(Category $category): Response
    {
        return Inertia::render('Category/Show', [
            'category' => $category->load('image')
        ]);
    }

    public function edit(Category $category): Response
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

        if ($request->deleted_image) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image->url);
                $category->image()->delete();
            }
        }

        if ($request->hasFile('image')) {
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

    public function destroy(Category $category)
    {
        if ($category->image) {
            Storage::disk('public')->delete($category->image->url);
            $category->image()->delete();
        }
        $category->delete();

        return redirect()->route('category.index')->with('success', 'Categoría eliminada con éxito.');
    }

    public function confirmDelete($categoryId)
    {
        $category = Category::findOrFail($categoryId);
        return response()->json($category);
    }

    public function catalog(): Response
    { 
        $categories = Category::with('image')->get();
        return Inertia::render('Category/Catalog', [
            'categories' => $categories 
        ]);
    }
}