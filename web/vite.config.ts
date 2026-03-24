import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath, URL } from "node:url"

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "../src/main/resources/static",
    emptyOutDir: true,
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("recharts")) {
              return "recharts"
            }
            if (id.includes("react")) {
              return "react"
            }
            if (id.includes("lucide-react")) {
              return "lucide"
            }
            if (id.includes("@radix-ui") || id.includes("@base-ui")) {
              return "ui"
            }
            return "vendor"
          }
        },
      },
    },
  },
})
