import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({ favorites }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold">Mis Favoritos</h2>}
        >
            <div className="max-w-2xl mx-auto mt-8">
                <ul className="divide-y divide-gray-200">
                    {favorites.length === 0 && (
                        <li className="py-4 text-gray-500">No tienes productos favoritos.</li>
                    )}
                    {favorites.map(product => (
                        <li key={product.id} className="py-4 flex items-center gap-4">
                            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                            <div>
                                <div className="font-semibold">{product.name}</div>
                                <div className="text-gray-500">${product.price}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
}