import React from "react";
import { Link } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebook,
    faTwitter,
    faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

export default function Footer({
    companyName = "UPP STORE",
    showSocial = true,
    showLinks = true,
    className = "",
    logo = "/images/Logo2.jpg",
    socialLinks = [
        {
            name: "Facebook",
            icon: faFacebook,
            url: "https://www.facebook.com/share/1AD6e2Ac1B/",
        },
        {
            name: "Twitter",
            icon: faTwitter,
            url: "https://x.com/theuppstore",
        },
        {
            name: "Instagram",
            icon: faInstagram,
            url: "https://www.instagram.com/codemakesoft_/",
        },
    ],
    linkGroups = [
        {
            title: "Enlaces",
            links: [
                {
                    name: "Nosotros",
                    url: "https://github.com/CodeCraftSoft/blue_app/tree/main",
                },
                { name: "Contacto", url: "https://wa.link/n8mxgj" },
            ],
        },
        {
            title: "Legal",
            links: [
                {
                    name: "Términos",
                    url: "/docs/terminos-y-condiciones.pdf",
                    target: "_blank",
                },
                {
                    name: "Privacidad",
                    url: "/docs/politica-privacidad.pdf",
                    target: "_blank",
                },
            ],
        },
    ],
    location = "Presilla 10, San Francisco, Del. La Magdalena Contreras, Ciudad de México, CP 10810 ",
}) {
    return (
        <footer
            className={`bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white py-6 ${className}`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="mb-4 md:mb-0">
                        <Link
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 transition-all duration-300 hover:opacity-90 group"
                        >
                            {logo && (
                                <img
                                    src={logo}
                                    alt={`Logo de ${companyName}`}
                                    className="h-8 md:h-10 object-contain transition-transform duration-300 group-hover:scale-110"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            )}
                            <span className="text-xl font-bold text-gray-900 dark:text-white transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {companyName}
                            </span>
                        </Link>
                    </div>
                </div>

                {showLinks && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 py-8">
                        {linkGroups.map((group, index) => (
                            <div key={index} className="mb-4 sm:mb-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-4 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400">
                                    {group.title}
                                </h3>
                                <ul className="space-y-2">
                                    {group.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <a
                                                href={link.url}
                                                target={link.target || "_blank"}
                                                rel="noopener noreferrer"
                                                className="text-gray-600 dark:text-gray-400 text-sm transition-all duration-300 transform hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400 flex items-start"
                                            >
                                                {link.target === "_blank" && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4 mt-0.5 mr-1"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        />
                                                    </svg>
                                                )}
                                                <span>{link.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        <div className="mb-4 sm:mb-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-4 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400">
                                Contacto
                            </h3>
                            <address className="text-gray-600 dark:text-gray-400 not-italic text-sm">
                                <p className="mb-2 transition-all duration-300 transform hover:scale-105">
                                    <a
                                        href="mailto:emmanuelislas@micorreo.upp.edu.mx"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-blue-600 dark:hover:text-blue-400"
                                    >
                                        cod3cr4fts0ft@gmail.com
                                    </a>
                                </p>
                                <p className="transition-all duration-300 transform hover:scale-105 hover:text-blue-600 dark:hover:text-blue-400">
                                    Tel: +52 123 456 7890
                                </p>
                            </address>
                        </div>

                        {/* Nueva columna solo para ubicación */}
                        <div className="mb-4 sm:mb-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-4 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400">
                                Ubicación
                            </h3>
                            <div className="group">
                                <div className="flex items-start transition-all duration-300 transform hover:scale-105">
                                    <FontAwesomeIcon
                                        icon={faMapMarkerAlt}
                                        className="mt-0.5 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-400 transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                    />
                                    <span className="text-gray-600 dark:text-gray-400 text-sm transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                        {location}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {showSocial && (
                            <div className="mb-4 sm:mb-0">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-4 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400">
                                    Síguenos
                                </h3>
                                <div className="flex flex-col space-y-3">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 dark:text-gray-400 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-3 group"
                                            aria-label={social.name}
                                        >
                                            <FontAwesomeIcon
                                                icon={social.icon}
                                                className="text-xl transition-transform duration-300 group-hover:scale-125"
                                            />
                                            <span className="text-sm transition-transform duration-300 group-hover:scale-105">
                                                {social.name}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Línea divisoria */}

            <div className="pt-6 text-center md:text-left text-gray-500 dark:text-gray-400 text-sm">
                <p className="transition-all duration-300 transform hover:scale-102 hover:text-gray-700 dark:hover:text-gray-300">
                    © {new Date().getFullYear()} {companyName}. Todos los
                    derechos reservados.
                </p>
            </div>
        </footer>
    );
}
