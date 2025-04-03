<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('categories',[CategoryController::class,'index'])->name('category.index');
    Route::get('categories/create',[CategoryController::class,'create'])->name('category.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('category.store');
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('category.edit');
    Route::post('/categories/{category}', [CategoryController::class, 'update'])->name('category.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('category.destroy');
    Route::get('/categories/catalog', [CategoryController::class, 'catalog'])->name('category.catalog');
    Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('category.show');

    Route::get('brands',[BrandController::class,'index'])->name('brand.index');
    Route::get('brands/create',[BrandController::class,'create'])->name('brand.create');
    Route::post('/brands', [BrandController::class, 'store'])->name('brand.store');
    Route::get('/brands/{brand}/edit', [BrandController::class, 'edit'])->name('brand.edit');
    Route::post('/brands/{brand}', [BrandController::class, 'update'])->name('brand.update');
    Route::delete('brands/{brand}', [BrandController::class, 'destroy'])->name('brand.destroy');
    Route::get('/brands/catalog', [BrandController::class, 'catalog'])->name('brand.catalog');
    Route::get('/brands/{brand}', [BrandController::class, 'show'])->name('brand.show');


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
