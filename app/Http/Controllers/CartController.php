<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Cart;
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

         // Return success message without redirecting
        return back()->with('success', 'Producto agregado al carrito.');
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

        // Return success message without redirecting
        return Inertia::render('Cart/Index', [
            'cart' => $cart,
            'success' => 'Producto eliminado del carrito.',
        ]);  
    }
    
    public function update(Request $request, $productId)
    {
        // Validar que 'quantity' sea un número entero mayor o igual a 0
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);
    
        // Obtener el usuario autenticado
        $user = Auth::user();
    
        // Obtener el carrito del usuario
        $cart = $user->cart;
    
        if ($cart) {
            // Verificar si el producto existe en el carrito
            if ($cart->products()->where('product_id', $productId)->exists()) {
                if ($request->quantity === 0) {
                    // Si la cantidad es 0, eliminar el producto
                    $cart->products()->detach($productId);
                } else {
                    // Actualizar la cantidad del producto
                    $cart->products()->updateExistingPivot($productId, [
                        'quantity' => $request->quantity,
                    ]);
                }
            }
        }
    
        // Return success message without redirecting
        return Inertia::render('Cart/Index', [
            'cart' => $cart,
            'success' => 'Cantidad actualizada.',
        ]);    
    }
}


