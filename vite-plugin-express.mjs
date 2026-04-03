/**
 * Vite plugin to integrate Express server for dev mode
 * This is loaded dynamically so esbuild doesn't try to analyze ./server imports
 */
export function expressPlugin() {
  return {
    name: "express-plugin",
    apply: "serve",
    async configureServer(server) {
      try {
        // Dynamic import only at runtime, not during config bundling
        const { createServer } = await import("./server/index.ts");
        const app = createServer();
        server.middlewares.use(app);
      } catch (error) {
        console.error("⚠️  Failed to load Express server:", error);
      }
    },
  };
}
