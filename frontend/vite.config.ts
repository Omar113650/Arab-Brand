import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

console.log("🔥 VITE CONFIG LOADED");

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://arab-brand-4qj7.vercel.app/",
        changeOrigin: true,
      },
    },
  },
});