<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $categories = Category::paginate(10);
        
        return Inertia::render('Admin/Category', [
            'categories' => $categories,
            'activeRoute' => $request->route()->getName(),
            'can' => [
                'category_edit' => $request->user() ? $request->user()->can('category-edit') : false,
                'category_delete' => $request->user() ? $request->user()->can('category-delete') : false,
                'category_create' => $request->user() ? $request->user()->can('category-create') : false,
                
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()  
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'picture' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['name', 'description']);
        if($request->hasFile('picture')){
            $file = $request->file('picture');
            $filename = time(). ' '.$file->getClientOriginalName();
            $path = $file->storeAs('uploads', $filename, 'public');
            $data['picture'] = '/storage/'.$path;
        }

        Category::create($data);
        return redirect()->route('categories.index')->with('success', 'Category Created Succesfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'picture' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['name', 'description']);

        if($request->hasFile('picture')){
            $file = $request->file('picture');
            $filename = time(). ' '.$file->getClientOriginalName();
            $path = $file->storeAs('uploads', $filename, 'public');
            $data['picture'] = '/storage/'.$path;
        }

        $category->update($data);
        return redirect()->route('categories.index')->with('success', 'Category Updated Succesfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('categories.index')->with('success', 'Category Deleted Succesfully.');
    }
}
