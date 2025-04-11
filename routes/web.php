<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PermissionController;
use App\Models\Location;

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

Route::get('/account', function () {
    return Inertia::render('Account');
})->middleware(['auth', 'verified'])->name('account');


Route::get('/admin', function () {
    return Inertia::render('Admin/AdminPanel', [
        'activeRoute' => request()->route()->getName(),
    ]);
})->middleware(['auth', 'verified', 'permission:can-access-admin-panel'])->name('admin.panel');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    //Crud address
    Route::get('address', [LocationController::class, 'index'])->name('address.index');
    Route::get('address/create', [LocationController::class, 'create'])->name('address.create');
    Route::put('address/{address}', [LocationController::class, 'update'])->name('address.update');
    Route::post('/address', [LocationController::class, 'store'])->name('address.store');
});

Route::group(['middleware' => ['auth']], function() {
    Route::resource('admin/categories', CategoryController::class);
    Route::resource('admin/users', UserController::class);
    Route::resource('admin/roles', RoleController::class);
    Route::resource('admin/permissions', PermissionController::class);
});





require __DIR__.'/auth.php';
