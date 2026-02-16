import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                analytics: resolve(__dirname, 'analytics.html'),
                customers: resolve(__dirname, 'customers.html'),
                products: resolve(__dirname, 'products.html'),
                orders: resolve(__dirname, 'orders.html'),
                settings: resolve(__dirname, 'settings.html'),
            },
        },
    },
});
