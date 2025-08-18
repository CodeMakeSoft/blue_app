<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud de Devolución</title>
    <link rel="stylesheet" href="{{ mix('css/app.css') }}">
</head>
<body class="p-6 bg-gray-100">
    <div class="max-w-lg p-6 mx-auto bg-white rounded shadow">
        <h1 class="mb-4 text-2xl font-bold">Solicitud de Devolución</h1>

        @if(session('success'))
            <div class="p-3 mb-4 text-green-700 bg-green-100 rounded">
                {{ session('success') }}
            </div>
        @endif

        <form action="{{ route('return.submit') }}" method="POST">
            @csrf

            <div class="mb-4">
                <label for="order_number" class="block mb-2 font-medium text-gray-700">
                    Número de Pedido:
                </label>
                <input type="text" name="order_number" id="order_number"
                       value="{{ request('order') ?? '' }}"
                       class="w-full p-2 border-gray-300 rounded"
                       readonly>
            </div>

            <div class="mb-4">
                <label for="reason" class="block mb-2 font-medium text-gray-700">
                    Motivo de la devolución:
                </label>
                <textarea name="reason" id="reason" rows="4"
                          class="w-full p-2 border-gray-300 rounded" required></textarea>
            </div>

            <button type="submit"
                    class="w-full py-2 text-white transition bg-blue-600 rounded hover:bg-blue-700">
                Enviar Solicitud
            </button>
        </form>
    </div>
</body>
</html>
