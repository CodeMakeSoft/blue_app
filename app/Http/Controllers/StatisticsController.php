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

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        // Asegura que solo administradores puedan acceder
        //if (Auth::user()->role !== 'admin') {
        //    abort(403);
        //}

        return Inertia::render('Admin/Statistics'); // Crear esta vista luego
    }

    public function salesData(Request $request)
    {
        $this->authorizeAdmin();

        $start = $request->input('start_date', now()->subMonth());
        $end = $request->input('end_date', now());

        $ventas = Order::whereBetween('created_at', [$start, $end])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($ventas);
    }

    public function topProducts(Request $request)
    {
        $this->authorizeAdmin();

        $start = $request->input('start_date', now()->subMonth());
        $end = $request->input('end_date', now());

        $productos = OrderProduct::whereHas('order', function ($q) use ($start, $end) {
                $q->whereBetween('created_at', [$start, $end]);
            })
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

        $ventas = OrderProduct::whereHas('order', function ($q) use ($start, $end) {
                $q->whereBetween('created_at', [$start, $end]);
            })
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

    private function authorizeAdmin()
    {
        if (!Auth::check() || Auth::user()->role !== 'admin') {
            abort(403);
        }
    }
}