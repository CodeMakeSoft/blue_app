<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\Brand;
use App\Models\Category;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Response;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    public function index()
    {
        return inertia('Admin/Statistics');
    }

    public function salesData(Request $request)
    {
        $start = $request->start_date;
        $end = $request->end_date;

        $query = DB::table('orders')
            ->join('order_product', 'orders.id', '=', 'order_product.order_id')
            ->join('products', 'order_product.product_id', '=', 'products.id')
            ->select(
                DB::raw('DATE(orders.created_at) as date'),
                DB::raw('SUM(order_product.price * order_product.quantity) as total')
            )
            ->whereBetween('orders.created_at', [$start, $end])
            ->groupBy('date')
            ->orderBy('date');

        if ($request->filled('product_id')) {
            $query->where('products.id', $request->product_id);
        }

        if ($request->filled('brand_id')) {
            $query->where('products.brand_id', $request->brand_id);
        }

        return response()->json($query->get());
    }

    public function salesByBrand(Request $request)
    {
        $start = $request->start_date;
        $end = $request->end_date;

        $sales = DB::table('order_product')
            ->join('products', 'order_product.product_id', '=', 'products.id')
            ->join('brands', 'products.brand_id', '=', 'brands.id')
            ->join('orders', 'order_product.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$start, $end])
            ->select('brands.name', DB::raw('SUM(order_product.quantity) as total_sold'))
            ->groupBy('brands.name')
            ->get();

        return response()->json($sales);
    }

    public function topProducts(Request $request)
    {
        $start = $request->start_date;
        $end = $request->end_date;

        $query = DB::table('order_product')
            ->join('products', 'order_product.product_id', '=', 'products.id')
            ->select('products.name as name', DB::raw('SUM(order_product.quantity) as total_sold'))
            ->groupBy('products.name')
            ->orderByDesc('total_sold')
            ->limit(10);

        if ($start && $end) {
            $query->join('orders', 'order_product.order_id', '=', 'orders.id')
                  ->whereBetween('orders.created_at', [$start, $end]);
        }

        return response()->json($query->get());
    }

    public function autocomplete(Request $request)
    {
        $term = $request->term;

        $products = Product::where('name', 'like', "%$term%")
            ->select('id', 'name')
            ->limit(10)
            ->get();

        return response()->json($products);
    }

    public function searchBrands(Request $request)
    {
        $q = $request->q;
        $brands = Brand::where('name', 'like', "%$q%")
            ->select('id', 'name')
            ->limit(10)
            ->get();

        return response()->json($brands);
    }

    public function searchCategories(Request $request)
    {
        $q = $request->q;
        $categories = Category::where('name', 'like', "%$q%")
            ->select('id', 'name')
            ->limit(10)
            ->get();

        return response()->json($categories);
    }

    public function exportCsv(Request $request)
    {
        $start = $request->start_date;
        $end = $request->end_date;
        $productId = $request->product_id;
        $brandId = $request->brand_id;

        $data = DB::table('orders')
            ->join('order_product', 'orders.id', '=', 'order_product.order_id')
            ->join('products', 'order_product.product_id', '=', 'products.id')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select(
                'products.name as producto',
                'categories.name as categoria',
                'order_product.quantity',
                'order_product.price',
                'orders.created_at'
            )
            ->whereBetween('orders.created_at', [$start, $end])
            ->when($productId, fn($query) => $query->where('products.id', $productId))
            ->when($brandId, fn($query) => $query->where('products.brand_id', $brandId))
            ->orderBy('orders.created_at', 'desc')
            ->get();

        $filename = "ventas_" . now()->format('Ymd_His') . ".csv";
        $headers = [
            "Content-type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');

            // ✅ BOM para Excel
            fwrite($file, chr(0xEF) . chr(0xBB) . chr(0xBF));

            // ✅ Encabezados
            fputcsv($file, ['Producto', 'Categoría', 'Cantidad', 'Precio', 'Total', 'Fecha']);

            foreach ($data as $row) {
                $total = $row->price * $row->quantity;

                fputcsv($file, [
                    mb_convert_encoding($row->producto, 'UTF-8', 'UTF-8'),
                    mb_convert_encoding($row->categoria ?? 'Sin categoría', 'UTF-8', 'UTF-8'),
                    $row->quantity,
                    number_format($row->price, 2),
                    number_format($total, 2),
                    Carbon::parse($row->created_at)->format('d/m/Y')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportPdf(Request $request)
    {
        $start = $request->start_date;
        $end = $request->end_date;

        $data = DB::table('orders')
            ->join('order_product', 'orders.id', '=', 'order_product.order_id')
            ->join('products', 'order_product.product_id', '=', 'products.id')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->select(
                'products.name as producto',
                'categories.name as categoria',
                'order_product.quantity',
                'order_product.price',
                'orders.created_at'
            )
            ->whereBetween('orders.created_at', [$start, $end])
            ->orderBy('orders.created_at', 'desc')
            ->get();

        // ✅ Preparar datos para PDF (calcular total y formato)
        foreach ($data as $d) {
            $d->total = $d->price * $d->quantity;
            $d->fecha = Carbon::parse($d->created_at)->format('d/m/Y');
        }

        $pdf = Pdf::loadView('admin.statistics.pdf', compact('data', 'start', 'end'));
        return $pdf->download('reporte_estadisticas_' . now()->format('Ymd_His') . '.pdf');
    }
}

