import Cart from "@/Components/Cart/Cart";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function index({ cart }) {

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Your Cart
                </h2>
            }
        >
            <Head title="Cart" />
            <div>
                <Cart cart={cart}/>
            </div>
        </AuthenticatedLayout>
    );
}

