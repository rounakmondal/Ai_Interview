import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5000,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
    // Manual chunk splitting for route-based code splitting
    // Reduces LCP by separating heavy routes into their own chunks
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react";
            if (id.includes("@radix-ui")) return "vendor-radix";
            if (id.includes("@tanstack")) return "vendor-tanstack";
            return "vendor";
          }

          // Route-specific chunks (lazy-loaded)
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
        }
      }
    }
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    async configureServer(server) {
      // Dynamic import so server code (and its deps like pdf-parse/pdfjs-dist)
      // are never loaded during `vite build` — only during `vite dev`.
      const { createServer } = await import("./server/index.ts");
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}
