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
        $user = Auth::user();
        $cart = $user->cart;

         // If user doesn't have a cart, create a new one
        if (!$cart) {
            $cart = Cart::create(['user_id' => $user->id]);
        }

        $products = $cart->products()->with('images')->withPivot('quantity')->get();

        return Inertia::render('Cart/Index', [
            'cart' => $products,
        ]);
    }

    // Add to cart
    public function add(Request $request, $productId)
    {
        $user = Auth::user();
        $cart = $user->cart;

        if (!$cart) {
            $cart = Cart::create(['user_id' => $user->id]);
        }

        if ($cart->products()->where('product_id', $productId)->exists()) {
            $cart->products()->updateExistingPivot($productId, [
                'quantity' => $cart->products()->find($productId)->pivot->quantity + 1,
            ]);
        } else {
            $cart->products()->attach($productId, ['quantity' => 1]);
        }

        $products = $cart->products()->with('images')->withPivot('quantity')->get();

        // return Inertia::render('Cart/Index', [
        //     'cart' => $products,
        // ]);
    }

    public function contains($productID)
    {
        $user = Auth::user();
        $cart = $user->cart;

        $exist = $cart && $cart->products()->where('product_id', $productID)->exists();

        return response()->json([
            'inCart' => $exist,
        ]);

    }

    // Remove from cart
    public function destroy($productId)
    {
        $user = Auth::user();
        $cart = $user->cart;

        if ($cart) {
            $cart->products()->detach($productId);
        }

        $products = $cart->products()->with('images')->withPivot('quantity')->get();

        // return Inertia::render('Cart/Index', [
        //     'cart' => $products,
        // ]);
        return redirect()->route('cart.index');
    }

    // Update cart quantity
    public function update(Request $request, $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $user = Auth::user();
        $cart = $user->cart;

        if ($cart && $cart->products()->where('product_id', $productId)->exists()) {
            if ($request->quantity === 0) {
                $cart->products()->detach($productId);
            } else {
                $cart->products()->updateExistingPivot($productId, [
                    'quantity' => $request->quantity,
                ]);
            }
        }

        $products = $cart->products()->with('images')->withPivot('quantity')->get();

        return redirect()->route('cart.index');
    }

    public function getCartStatus()
    {
        $user = Auth::user();
        $cart = $user->cart;
    
        if (!$cart) {
            return response()->json([
                'count' => 0,
                'items' => []
            ]);
        }
    
        $products = $cart->products()->with('images')->withPivot('quantity')->get();
    
        return response()->json([
            'count' => $products->count(),
            'items' => $products
        ]);
    }
}