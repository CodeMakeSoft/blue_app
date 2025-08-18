<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use function PHPUnit\Framework\returnArgument;

class FavoriteController extends Controller
{
    public function index() {
        $favorites = Favorite::where('user_id', Auth::id())
            ->with(['product.images'])
            ->get();
        return inertia('Favorites/Index', [
            'favorites' => $favorites
        ]);
    }

    public function store(Request $request){
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);
        $user = Auth::user();
        $productId = $request->product_id;
        $exists = Favorite::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();

        if(!$exists) {
            Favorite::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
        }

        return response()->json(['success' => true]);
    }

    public function contains(Product $product) {
        $user = Auth::user();
        $exists = Favorite::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->exists();

        return response()->json(['liked' => $exists]);
    }

    public function destroy(Product $product) {
        $user = Auth::user();
        Favorite::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->delete();

        if (request()->header('X-Inertia')) {
            // Petición Inertia: redirige usando Inertia::location para evitar error
            return \Inertia\Inertia::location(url()->previous());
        }

        if (request()->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->back()->with('success', 'Producto eliminado de favoritos.');
    }
}


