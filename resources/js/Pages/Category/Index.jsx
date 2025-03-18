import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

export default function Index({auth,categories}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Categories
                    </h2>
                    <Link href={route("category.create")}>
                        <PlusCircleIcon className="w-8 h-8 mr-4" />
                    </Link>
                </div>
            }
        >
            <Head title="Category" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900"></div>

                        <div className="mt-6">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 px-4 py-2">
                                            Nombre
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Descripción
                                        </th>
                                        <th className="border border-gray-300 px-4 py-2">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.length > 0
                                        ? categories.map((category) => (
                                              <tr
                                                  key={category.id}
                                                  className="text-center"
                                              >
                                                  <td className="border border-gray-300 px-4 py-2">
                                                      {category.name}
                                                  </td>
                                                  <td className="border border-gray-300 px-4 py-2">
                                                      {category.description}
                                                  </td>
                                                  <td className="border border-gray-300 px-4 py-2">
                                                      <Link
                                                          className="text-blue-500 flex items-center"
                                                          href={route(
                                                              "category.edit",
                                                              category.id
                                                          )}
                                                      >
                                                          <PencilSquareIcon className="w-5 h-5 mr-1" />
                                                      </Link>
                                                      <Link
                                                          className="text-red-500 flex items-center"
                                                          href={route(
                                                              "category.confirmDelete",
                                                              category.id
                                                          )}
                                                      >
                                                          <TrashIcon className="w-5 h-5 mr-1" />
                                                      </Link>
                                                  </td>
                                              </tr>
                                          ))
                                        : null}
                                </tbody>
                            </table>
                            <br></br>
                            <br></br>
                            <br></br>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
