<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Ventas</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
        }

        h1 {
            text-align: center;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th, td {
            border: 1px solid #666;
            padding: 6px;
            text-align: left;
        }

        th {
            background-color: #f0f0f0;
        }

        .fecha-rango {
            font-size: 12px;
            margin-bottom: 10px;
        }

        .total-final {
            margin-top: 20px;
            text-align: right;
            font-weight: bold;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <h1>Reporte de Ventas</h1>

    <div class="fecha-rango">
        <strong>Desde:</strong> {{ $start }}<br>
        <strong>Hasta:</strong> {{ $end }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
                <th>Fecha</th>
            </tr>
        </thead>
        <tbody>
            @php $granTotal = 0; @endphp
            @forelse($data as $item)
                @php $granTotal += $item->total; @endphp
                <tr>
                    <td>{{ $item->producto }}</td>
                    <td>{{ $item->categoria ?? 'Sin categoría' }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>${{ number_format($item->price, 2) }}</td>
                    <td>${{ number_format($item->total, 2) }}</td>
                    <td>{{ $item->fecha }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center;">No hay datos disponibles para el rango de fechas seleccionado.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    @if(count($data) > 0)
        <div class="total-final">
            Total general de ventas: ${{ number_format($granTotal, 2) }}
        </div>
    @endif
</body>
</html>
