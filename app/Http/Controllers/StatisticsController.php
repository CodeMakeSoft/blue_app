<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Log;


class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Admin/Statistics');
    }

    public function salesData(Request $request)
    {
        $this->authorizeAdmin();

        $start = $request->input('start_date', now()->subMonth());
        $end = $request->input('end_date', now());
        $productId = $request->input('product_id');
        $brandId = $request->input('brand_id');
        $categoryId = $request->input('category_id');

        $query = DB::table('orders')
            ->join('order_product', 'orders.id', '=', 'order_product.order_id')
            ->join('products', 'order_product.product_id', '=', 'products.id')
            ->when($productId, fn($q) => $q->where('products.id', $productId))
            ->when($brandId, fn($q) => $q->where('products.brand_id', $brandId))
            ->when($categoryId, fn($q) => $q->where('products.category_id', $categoryId))
            ->whereBetween('orders.created_at', [$start, $end])
            ->select(DB::raw('DATE(orders.created_at) as date'), DB::raw('SUM(order_product.price * order_product.quantity) as total'))
            ->groupBy('date')
            ->orderBy('date');

        return response()->json($query->get());
    }

    public function topProducts(Request $request)
    {
        $this->authorizeAdmin();

        $start = $request->input('start_date', now()->subMonth());
        $end = $request->input('end_date', now());

        $productos = OrderProduct::whereHas('order', fn($q) => $q->whereBetween('created_at', [$start, $end]))
            ->select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->with('product:id,name')
            ->take(10)
            ->get();

        return response()->json($productos);
    }

    public function salesByBrand(Request $request)
    {
        $this->authorizeAdmin();

        $start = $request->input('start_date', now()->subMonth());
        $end = $request->input('end_date', now());

        $ventas = OrderProduct::whereHas('order', fn($q) => $q->whereBetween('created_at', [$start, $end]))
            ->join('products', 'order_products.product_id', '=', 'products.id')
            ->join('brands', 'products.brand_id', '=', 'brands.id')
            ->select('brands.name', DB::raw('SUM(order_products.quantity) as total_sold'))
            ->groupBy('brands.name')
            ->orderByDesc('total_sold')
            ->get();

        return response()->json($ventas);
    }

    public function exportCSV(Request $request): StreamedResponse
    {
        $this->authorizeAdmin();

        $filename = 'estadisticas_ventas.csv';
        $headers = ["Content-type" => "text/csv", "Content-Disposition" => "attachment; filename=$filename"];

        $callback = function () use ($request) {
            $start = $request->input('start_date', now()->subMonth());
            $end = $request->input('end_date', now());

            $data = Order::whereBetween('created_at', [$start, $end])
                ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as total'))
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Fecha', 'Total Vendido']);

            foreach ($data as $row) {
                fputcsv($handle, [$row->date, $row->total]);
            }
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function autocomplete(Request $request)
    {
        $term = $request->input('term');

        $results = Product::where('name', 'like', "%{$term}%")
            ->select('id', 'name')
            ->limit(10)
            ->get();

        return response()->json($results);
    }

    private function authorizeAdmin()
    {
        $user = Auth::user();
        \Log::info('Verificando rol', [
            'user_id' => $user?->id,
            'roles' => $user?->getRoleNames()
        ]);

    if (!$user || !$user->hasRole('admin')) {
        abort(403);
    }
    }  
    public function searchBrands(Request $request)
    {
        $query = $request->input('q');
        $brands = Brand::where('name', 'like', '%' . $query . '%')
            ->select('id', 'name')
            ->limit(10)
            ->get();

        return response()->json($brands);
    }

    public function searchCategories(Request $request)
     {
         $query = $request->input('q');
        $categories = Category::where('name', 'like', '%' . $query . '%')
            ->select('id', 'name')
            ->limit(10)
            ->get();

        return response()->json($categories);
    }

}
