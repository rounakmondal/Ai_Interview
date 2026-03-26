import path from "path";
import fs from "fs";
import { createServer } from "./index";
import * as express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// Serve static files from the SPA build
app.use(express.static(distPath));

// Also serve the original public/ folder (for PDF subfolders like Police/, WBCS/, SSC/)
// In some deployments, Vite copies public/ into dist/spa/ but in others
// (e.g. Render, Railway), the original public/ folder may still be at project root
const publicPath = path.join(process.cwd(), "public");
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  console.log(`📂 Serving additional static files from: ${publicPath}`);
}

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
