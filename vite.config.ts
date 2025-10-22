import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // forward frontend /api/* to backend http://localhost:8080/*
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
            "/realtime": {
                target: "http://localhost:8081",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/realtime/, ""),
            },
        },
    },
});
