import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: process.env.BASE_PATH || "/",

  plugins: [
    react(),
                            tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
                            "@assets": path.resolve(__dirname, "src/assets"),
    },
    dedupe: ["react", "react-dom"],
  },

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    port: 5173,
    open: true,
  },

  preview: {
    port: 4173,
  },
});
