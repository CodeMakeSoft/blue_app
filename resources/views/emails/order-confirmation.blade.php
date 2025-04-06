@component('mail::layout')
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            {{ config('app.name') }}
        @endcomponent
    @endslot

    # ¡Gracias por tu compra!

    Hemos recibido tu pedido **#{{ $order->id }}** correctamente.

    **Detalles del pedido:**
    - **Total:** ${{ number_format($order->total, 2) }}
    - **Fecha:** {{ $order->created_at->format('d/m/Y H:i') }}
    - **Estado:** {{ ucfirst($order->status) }}

    @component('mail::button', ['url' => route('orders.show', $order->id)])
        Ver detalles del pedido
    @endcomponent

    @slot('footer')
        @component('mail::footer')
            © {{ date('Y') }} {{ config('app.name') }}. Todos los derechos reservados.
        @endcomponent
    @endslot
@endcomponent