const Pagination = ({ data, onPageChange }) => {
    return (
        <div className="flex justify-end mt-4">
            <nav>
                <ul className="flex gap-2">
                    {data.links.map((link, index) => (
                        <li key={index}>
                            <button
                                onClick={() => onPageChange(link.url)}
                                className={`px-3 py-1 rounded transition-all ${
                                    link.active
                                        ? "bg-blue-500 dark:bg-blue-600 text-white"
                                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-500 hover:bg-gray-100 dark:hover:bg-gray-600"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                disabled={!link.url}
                            >
                                {link.label
                                    .replace("&laquo;", "«")
                                    .replace("&raquo;", "»")}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;
