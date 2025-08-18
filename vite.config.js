import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],

    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
    optimizeDeps: {
        include: [
            '@inertiajs/react', 
            'prop-types'
        ],
        exclude: [] // Puedes añadir exclusiones si es necesario
    },
    server: {
        hmr: {
            host: 'localhost',
        },
            host: '0.0.0.0', // permite conexiones externas
        port: 5173,
        cors: true, // habilita CORS para cualquier origen
    },
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', '@inertiajs/react', 'prop-types']
                }
            }
        }
    }
});