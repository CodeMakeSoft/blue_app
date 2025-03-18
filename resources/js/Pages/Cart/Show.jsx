import Cart from "@/Components/Cart/Cart";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function CartPage({ }) {

    const products = [
        { id: 1, name: 'Producto 1', price: 10.99 },
        { id: 2, name: 'Producto 2', price: 20.50 },
        { id: 3, name: 'Producto 3', price: 5.75 },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Cart
                </h2>
            }
        >
            <Head title="Cart" />
            <div className="mt-9 w-vh-1/2">
                <Cart cartItems={products}/>
            </div>
        </AuthenticatedLayout>
    );
}