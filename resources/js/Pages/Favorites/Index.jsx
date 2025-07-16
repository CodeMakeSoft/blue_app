import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Form from "@/Components/Favorite/Form";

export default function Index({ favorites }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold">Mis Favoritos</h2>}
        >
            <Form favorites={favorites} />
        </AuthenticatedLayout>
    );
}
