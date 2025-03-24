<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\User;
use App\Models\Product;
use Inertia\Inertia;

class CartController extends Controller
{
    // Show cart
    public function index()
    {
        // Get authenticated user
        $user = Auth::user();

        // Get cart of user
        $cart = $user->cart;

        // If user doesn't have a cart, create a new one
        if (!$cart) {
            $cart = Cart::create(['user_id' => $user->id]);
        }

        // Get products with quantity (pivot)
        $products = $cart->products()->with('images')->withPivot('quantity')->get();

        // Return the view of cart with products
        return Inertia::render('Cart/Index', ['cart' => $products]);
    }

    // Add to cart
    public function add(Request $request, $productId)
    {
        // Get authenticated user
        $user = Auth::user();

        // Get cart of user
        $cart = $user->cart;

        // If user doesn't have a cart, create a new one
        if (!$cart) {
            $cart = Cart::create(['user_id' => $user->id]);
        }

        // Verify if product already is in cart
        if ($cart->products()->where('product_id', $productId)->exists()) {
            // If product is in cart, increment quantity
            $cart->products()->updateExistingPivot($productId, [
                'quantity' => $cart->products()->find($productId)->pivot->quantity + 1,
            ]);
        } else {
            // If product isn't in cart, add with quantity 1
            $cart->products()->attach($productId, ['quantity' => 1]);
        }

        // Redirect back with success message
        return redirect()->back()->with('success', 'Producto agregado al carrito.');
    }

    public function remove($productId)
    {
        // Get authenticated user
        $user = Auth::user();

        // Get cart of user
        $cart = $user->cart;

        if ($cart)
        {
            $cart->products()->detach($productId);
        }

         // Redirect back with success message
        return redirect()->back()->with('success', 'Producto eliminado del carrito.');
    }

    public function update(Request $request, $productId)
    {
        // Obtener el usuario autenticado
        $user = Auth::user();

        // Obtener el carrito del usuario
        $cart = $user->cart;

        if ($cart) {
            // Obtener la cantidad actual del producto
            $currentQuantity = $cart->products()->find($productId)?->pivot->quantity;

            if ($currentQuantity > 0) {
                // Actualizar la cantidad
                $cart->products()->updateExistingPivot($productId, [
                    'quantity' => $request->quantity,
                ]);
            } else {
                // Eliminar el producto si la cantidad es 0
                $cart->products()->detach($productId);
            }
        }

        // Redirigir de vuelta con un mensaje de éxito
        return redirect()->back()->with('success', 'Cantidad actualizada.');
    }

    public function confirm()
    {
        return Inertia::render('Cart/Confirm');
    }
}


