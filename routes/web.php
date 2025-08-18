<?php

use Inertia\Inertia;
use App\Mail\TestEmail;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Mail;
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
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ReturnController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ShippingAddressController;
use App\Http\Controllers\Admin\StatisticsController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

Route::get('/test-email', function () {
    Mail::to('tu_correo_de_destino@gmail.com')
        ->send(new \App\Mail\TestEmail('¡Hola! Este es un correo de prueba desde Laravel con Gmail.'));
    return 'Correo enviado ✅ Revisa tu bandeja.';
});
use App\Http\Middleware\NoCacheMiddleware;


/*
|--------------------------------------------------------------------------
| Rutas públicas
|--------------------------------------------------------------------------
*/

// ✅ Deja una sola ruta raíz (elige la que uses). Mantengo la de HomeController.
Route::get('/', [HomeController::class, 'welcome'])->name('welcome');

// Si quieres la pantalla de Inertia "Welcome" en lugar de HomeController, descomenta esto y elimina la anterior:
// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

/*
|--------------------------------------------------------------------------
| Verificación de Email
|--------------------------------------------------------------------------
*/
// Vista que indica "verifica tu correo"
Route::get('/email/verify', function () {
    // Blade: return view('auth.verify-email');
    // Inertia: return inertia('Auth/VerifyEmail');
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');

// Link firmado que confirma el correo
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill(); // setea email_verified_at
    return redirect()->route('dashboard'); // o donde quieras
})->middleware(['auth', 'signed'])->name('verification.verify');

// Reenvío del correo de verificación
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
        Route::get('/export-pdf', [StatisticsController::class, 'exportPdf'])->name('exportPdf'); // ⬅️ movido aquí

        // 🔍 Autocompletado y búsqueda
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

    // Vista general de dirección
    Route::get('/address', fn () => Inertia::render('Address/AddressForm', [
        'activeRoute' => request()->route()->getName(),
    ]));
    
    // Recursos Admin
    Route::resource('admin/users', UserController::class);
    Route::middleware(['auth', 'single.superadmin'])->group(function () {
        Route::resource('admin/users', UserController::class);
    });
    
    Route::resource('admin/roles', RoleController::class);
    Route::resource('admin/permissions', PermissionController::class);

    // Categorías
    Route::middleware([NoCacheMiddleware::class])->group(function () {
        Route::get('categories', [CategoryController::class, 'index'])->name('category.index');
        Route::get('categories/create', [CategoryController::class, 'create'])->name('category.create');
        Route::post('/categories', [CategoryController::class, 'store'])->name('category.store');
        Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('category.edit');
        Route::post('/categories/{category}', [CategoryController::class, 'update'])->name('category.update');
        Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('category.destroy');
        Route::get('/categories/catalog', [CategoryController::class, 'catalog'])->name('category.catalog');
        Route::
        get('/categories/{category}', [CategoryController::class, 'show'])->name('category.show');
        Route::get('/categories/{category}/products', [CategoryController::class, 'products'])->name('categories.products');
    });
    
    // Marcas
    Route::middleware([NoCacheMiddleware::class])->group(function () {
        Route::get('brands', [BrandController::class, 'index'])->name('brand.index');
        Route::get('brands/create', [BrandController::class, 'create'])->name('brand.create');
        Route::post('/brands', [BrandController::class, 'store'])->name('brand.store');
        Route::get('/brands/{brand}/edit', [BrandController::class, 'edit'])->name('brand.edit');
        Route::post('/brands/{brand}', [BrandController::class, 'update'])->name('brand.update');
        Route::delete('brands/{brand}', [BrandController::class, 'destroy'])->name('brand.destroy');
        Route::get('/brands/catalog', [BrandController::class, 'catalog'])->name('brand.catalog');
        Route::get('/brands/{brand}', [BrandController::class, 'show'])->name('brand.show');
        Route::get('/brands/{brand}/products', [BrandController::class, 'products'])->name('brands.products');
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

    // Favoritos
    Route::resource('favorites', FavoriteController::class)->only(['index', 'store']);
    // Ruta DELETE personalizada para eliminar favorito por producto
    Route::delete('favorites/{product}', [FavoriteController::class, 'destroy'])->name('favorites.destroy');
    // Ruta para verificar si un producto está en favoritos
    Route::get('favorites/contains/{product}', [FavoriteController::class, 'contains'])->name('favorites.contains');

    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    //Vendedor
    Route::middleware(['auth', 'no_roles'])->group(function () {
        Route::get('/seller/register', [SellerController::class, 'create'])->name('seller.register');
        Route::post('/seller/register', [SellerController::class, 'store'])->name('seller.store');
    });

    // CRUD Direcciones
    Route::middleware(['auth'])->group(function () {
    Route::resource('address', ShippingAddressController::class);
    Route::post('address/{id}/default', [ShippingAddressController::class, 'setDefault'])->name('address.set-default');
    });
    Route::get('/address', [ShippingAddressController::class, 'index'])->name('address.index');
    Route::get('/address/create', [ShippingAddressController::class, 'create'])->name('address.create');
    Route::get('/address/{address}/edit', [ShippingAddressController::class, 'edit'])->name('address.edit');
    Route::post('/address', [ShippingAddressController::class, 'store'])->name('address.store');
    Route::put('/address/{address}', [ShippingAddressController::class, 'update'])->name('address.update');
    Route::delete('/address/{address}', [ShippingAddressController::class, 'destroy'])->name('address.destroy');



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

    // Recursos Admin
    Route::resource('admin/users', UserController::class);
    Route::resource('admin/roles', RoleController::class);
    Route::resource('admin/permissions', PermissionController::class);

    //rutas mamastrosas asi bien masizas todas diabolicas .php 
    Route::get('/devolucion', [ReturnController::class, 'showForm'])->name('return.form');
    Route::post('/devolucion', [ReturnController::class, 'submitForm'])->name('return.submit');

});

/*
|--------------------------------------------------------------------------
| Auth scaffolding (login/registro olvidé password, etc.)
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php'; // mantiene tus rutas de auth (Breeze/Fortify/etc.)

// ❌ Eliminado: Route::get('/admin/statistics/export-pdf', ...) fuera del grupo
