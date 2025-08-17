<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\SellerController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ShippingAddressController;
use App\Http\Controllers\Admin\StatisticsController;

use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use App\Mail\TestEmail;
use Illuminate\Support\Facades\Mail;

// Ruta de prueba para enviar email (desde fork)
Route::get('/test-email', function () {
    Mail::to('tu_correo_de_destino@gmail.com')
        ->send(new TestEmail('¡Hola! Este es un correo de prueba desde Laravel con Gmail.'));
    return 'Correo enviado ✅ Revisa tu bandeja.';
});

/*
|--------------------------------------------------------------------------
| Rutas públicas
|--------------------------------------------------------------------------
*/

Route::get('/', [HomeController::class, 'welcome'])->name('welcome');

/*
|--------------------------------------------------------------------------
| Verificación de Email
|--------------------------------------------------------------------------
*/

Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect()->route('dashboard');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();
    return back()->with('message', 'Enlace de verificación enviado.');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');

/*
|--------------------------------------------------------------------------
| Rutas autenticadas y verificadas
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // Estadísticas administrativas
    Route::prefix('admin/statistics')->name('admin.statistics.')->group(function () {
        Route::get('/', [StatisticsController::class, 'index'])->name('index');
        Route::get('/sales-data', [StatisticsController::class, 'salesData'])->name('salesData');
        Route::get('/top-products', [StatisticsController::class, 'topProducts'])->name('topProducts');
        Route::get('/sales-by-brand', [StatisticsController::class, 'salesByBrand'])->name('salesByBrand');
        Route::get('/export-csv', [StatisticsController::class, 'exportCSV'])->name('exportCSV');
        Route::get('/export-pdf', [StatisticsController::class, 'exportPdf'])->name('exportPdf');
        Route::get('/products/search', [StatisticsController::class, 'searchProducts'])->name('products.search');
        Route::get('/autocomplete', [StatisticsController::class, 'autocomplete'])->name('autocomplete');
        Route::get('/brands/search', [StatisticsController::class, 'searchBrands'])->name('brands.search');
        Route::get('/categories/search', [StatisticsController::class, 'searchCategories'])->name('categories.search');
    });

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Cuenta
    Route::get('/account', fn () => Inertia::render('Account'))->name('account');

    // Admin Panel
    Route::get('/admin', fn () => Inertia::render('Admin/AdminPanel', [
        'activeRoute' => request()->route()->getName(),
    ]))->middleware('permission:can-access-admin-panel')->name('admin.panel');

    // CRUD de usuarios/roles/permissions
    Route::middleware(['auth', 'single.superadmin'])->group(function () {
        Route::resource('admin/users', UserController::class);
    });
    Route::resource('admin/roles', RoleController::class);
    Route::resource('admin/permissions', PermissionController::class);

    // CRUD direcciones
    Route::middleware(['auth'])->group(function () {
        Route::resource('address', ShippingAddressController::class);
        Route::post('address/{id}/default', [ShippingAddressController::class, 'setDefault'])->name('address.set-default');
    });

    // Productos
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::get('/products', [ProductController::class, 'view'])->name('products.view');
    Route::get('/products/index', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::post('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::get('/products/{product}/confirm-delete', [ProductController::class, 'confirmDelete'])->name('products.confirmDelete');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Vendedor
    Route::middleware(['auth', 'no_roles'])->group(function () {
        Route::get('/seller/register', [SellerController::class, 'create'])->name('seller.register');
        Route::post('/seller/register', [SellerController::class, 'store'])->name('seller.store');
    });

    // Carrito
    Route::resource('cart', CartController::class)->only(['index', 'update', 'destroy']);
    Route::get('cart/add/{product}', [CartController::class, 'add'])->name('cart.add');
    Route::get('cart/contains/{product}', [CartController::class, 'contains'])->name('cart.contains');

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout/cod', [CheckoutController::class, 'processCod'])->name('checkout.cod');
    Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
    Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');
    Route::post('/checkout/paypal/order', [CheckoutController::class, 'createPaypalOrder'])->name('checkout.paypal.create');
    Route::post('/checkout/paypal/capture', [CheckoutController::class, 'capturePaypalOrder'])->name('checkout.paypal.capture');
    Route::get('/checkout/buy-now/{product}', [CheckoutController::class, 'buyNow'])->name('checkout.buy-now');

    // Pedidos
    Route::get('/purchases', [OrderController::class, 'index'])->name('purchases.index');
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
});

/*
|--------------------------------------------------------------------------
| Auth scaffolding
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';
