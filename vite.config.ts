import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from "@tailwindcss/vite";
// import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: "automatic",
        }),
        tailwindcss()
        // dts({
        //     insertTypesEntry: true
        // })
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'Sibtorsh Player',
            fileName: (format) => `sibtorsh-player.${format}.js`
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'prop-types'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'prop-types': 'PropTypes'
                }
            }
        },
        minify: "esbuild"
    },
    define: {
        define: {
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }
    }
});
