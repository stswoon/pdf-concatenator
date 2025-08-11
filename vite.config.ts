import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {type ManifestOptions, VitePWA} from "vite-plugin-pwa";

const manifest: Partial<ManifestOptions> = {
    name: "PDF concatenator",
    short_name: "PDF concatenator",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
        {
            src: "/favicon.png",
            sizes: "192x192",
            type: "image/png",
        },
    ],
};

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            devOptions: {
                enabled: true,
            },
            minify: false,
            injectRegister: "auto",
            registerType: "prompt",
            manifest: manifest,
        })
    ],
    build: {
        manifest: true,
    }
})
