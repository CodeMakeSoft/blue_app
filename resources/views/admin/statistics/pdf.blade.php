<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #333; padding: 6px; text-align: left; }
        th { background-color: #f0f0f0; }
    </style>
</head>
<body>
    <h2>Reporte de Ventas</h2>
    <p>Desde: {{ $start }} — Hasta: {{ $end }}</p>
    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $fila)
                <tr>
                    <td>{{ $fila->producto }}</td>
                    <td>{{ $fila->quantity }}</td>
                    <td>${{ number_format($fila->price, 2) }}</td>
                    <td>{{ \Carbon\Carbon::parse($fila->created_at)->format('d/m/Y H:i') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
