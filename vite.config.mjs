import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    host: "::",
    port: 5000,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path, // Keep the /api path as-is when forwarding
      },
    },
  },
  build: {
    outDir: "dist/spa",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react";
            if (id.includes("@radix-ui")) return "vendor-radix";
            if (id.includes("@tanstack")) return "vendor-tanstack";
            return "vendor";
          }
          if (id.includes("pages/GovtPractice") || id.includes("pages/GovtTest") || id.includes("pages/GovtResult")) {
            return "chunk-govt-exam";
          }
          if (id.includes("pages/StudyPlan") || id.includes("pages/SyllabusTracker") || id.includes("pages/ChapterTest")) {
            return "chunk-study";
          }
          if (id.includes("pages/Chatbot") || id.includes("pages/StudyWithMe") || id.includes("pages/StoryTelling")) {
            return "chunk-social";
          }
          if (id.includes("pages/Dashboard") || id.includes("pages/Leaderboard") || id.includes("pages/Profile")) {
            return "chunk-dashboard";
          }
          if (id.includes("pages/MockTestPage") || id.includes("pages/PDFMockTest") || id.includes("pages/QuestionHub")) {
            return "chunk-tests";
          }
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
