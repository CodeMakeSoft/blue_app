<?php
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProductController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\GoogleApiController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\BrandController;
use Illuminate\Support\Facades\Response;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PayPalController;

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
});

Route::get('/admin', function () {
    return Inertia::render('Admin/AdminPanel', [
        'activeRoute' => request()->route()->getName(),
    ]);
})->middleware(['auth', 'verified', 'permission:can-access-admin-panel'])->name('admin.panel');

Route::get('/address', function () {
    return Inertia::render('Address/AddressForm', [
        'activeRoute' => request()->route()->getName(),
    ]);
})->middleware(['auth', 'verified']);

Route::middleware('auth')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Product Routes - Fixed routes first
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::get('/products/mange', [ProductController::class, 'manage'])->name('products.manage');
    
    // Product resource routes
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
    
    // Routes with parameters should come after fixed routes
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::get('/products/{product}/confirm-delete', [ProductController::class, 'confirmDelete'])->name('products.confirmDelete');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::get('/products/{product}', [ProductController::class, 'show'])->name('products.show');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::resource('cart', CartController::class)->only(['index', 'update', 'destroy']);
    Route::get('cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
    Route::get('cart/contains/{product}', [CartController::class, 'contains'])->name('cart.contains');

    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout/cod', [CheckoutController::class, 'processCod'])->name('checkout.cod');
    Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');
    
    Route::post('/checkout/paypal/order', [CheckoutController::class, 'createPaypalOrder'])->name('checkout.paypal.create');
    Route::post('/checkout/paypal/capture', [CheckoutController::class, 'capturePaypalOrder'])->name('checkout.paypal.capture');
});

Route::middleware('auth')->get('/purchases', [OrderController::class, 'index'])->name('purchases.index');
Route::middleware('auth')->post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');


Route::group(['middleware' => ['auth']], function() {
    Route::resource('admin/categories', CategoryController::class);
    Route::resource('admin/users', UserController::class);
    Route::resource('admin/roles', RoleController::class);
    Route::resource('admin/permissions', PermissionController::class);
});



require __DIR__.'/auth.php';
