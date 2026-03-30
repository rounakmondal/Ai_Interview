import { RequestHandler } from "express";
import path from "path";
import fs from "fs";

/**
 * Resolve the public directory that contains PDF subfolders (Police/, WBCS/, SSC/).
 * 
 * In development:  process.cwd() → project root, so public/ is right there.
 * In production:   The built server runs from dist/server/, and Vite copies
 *                  public/ contents into dist/spa/ — so we also check there.
 *                  Additionally, on some hosts process.cwd() is the project
 *                  root and the original public/ still exists.
 */
function resolvePublicDir(): string {
  const candidates = [
    // 1. Standard dev: project_root/public
    path.join(process.cwd(), "public"),
    // 2. Production: dist/spa (Vite copies public/* here)
    path.join(process.cwd(), "dist", "spa"),
    // 3. Relative to this file (works for compiled dist/server/production.mjs)
    path.resolve(import.meta.dirname ?? __dirname, "..", "spa"),
    path.resolve(import.meta.dirname ?? __dirname, "..", "..", "public"),
  ];

  for (const dir of candidates) {
    // Check if this dir actually contains one of our exam folders
    if (fs.existsSync(path.join(dir, "Police")) || fs.existsSync(path.join(dir, "WBCS")) || fs.existsSync(path.join(dir, "WBPSC")) || fs.existsSync(path.join(dir, "WB Primary TET Question"))) {
      return dir;
    }
  }

  // Fallback to CWD/public even if the folders don't exist yet
  return candidates[0];
}

const PUBLIC_DIR = resolvePublicDir();
console.log(`📂 Questions API: PUBLIC_DIR resolved to ${PUBLIC_DIR}`);

/** Whitelist: maps lowercase route key → actual subfolder name under public/ */
const VALID_FOLDERS: Record<string, string> = {
  police: "Police",
  wbcs: "WBCS",
  wbpsc: "WBPSC",
  ssc: "SSC",
  "wb-primary-tet": "WB Primary TET Question",
};

/**
 * GET /api/questions/:folder
 * Returns list of PDF and JSON files from the requested public subfolder (including subfolders).
 * For Police: scans Police/police-json-data/ recursively including SI/ subfolder.
 * Returns empty array when the folder doesn't exist yet (graceful).
 */
export const listFolderQuestions: RequestHandler = (req, res) => {
  const key = (req.params.folder ?? "").toLowerCase();
  const folderName = VALID_FOLDERS[key];

  if (!folderName) {
    return res.status(400).json({ error: "Invalid folder" });
  }

  // For police, look in police-json-data subdirectory; for others, use the folder directly
  const basePath = key === "police" 
    ? path.join(PUBLIC_DIR, folderName, "police-json-data")
    : path.join(PUBLIC_DIR, folderName);

  if (!fs.existsSync(basePath)) {
    return res.json({ success: true, folder: folderName, count: 0, files: [] });
  }

  try {
    const filesList: Array<{ name: string; path: string; size: number }> = [];

    // Helper function to recursively scan directories
    const scanDir = (dir: string, relativePrefix = "") => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      entries.forEach((entry) => {
        if (entry.isFile()) {
          // Include both PDF and JSON files
          if (
            entry.name.toLowerCase().endsWith(".pdf") ||
            entry.name.toLowerCase().endsWith(".json")
          ) {
            const relativePath = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
            const fullPath = path.join(dir, entry.name);
            filesList.push({
              name: entry.name,
              path: key === "police"
                ? `/${folderName}/police-json-data/${encodeURIComponent(relativePath)}`
                : `/${folderName}/${encodeURIComponent(relativePath)}`,
              size: fs.statSync(fullPath).size,
            });
          }
        } else if (entry.isDirectory() && entry.name !== "." && entry.name !== "..") {
          // Recursively scan subdirectories (like SI/)
          const newPrefix = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
          scanDir(path.join(dir, entry.name), newPrefix);
        }
      });
    };

    scanDir(basePath);

    res.json({
      success: true,
      folder: folderName,
      count: filesList.length,
      files: filesList,
    });
  } catch (err) {
    console.error("Error listing folder questions:", err);
    res.status(500).json({ error: "Failed to list questions" });
  }
};

/**
 * GET /api/questions/:folder/*filePath
 * Serves a PDF or JSON file directly from the whitelisted public subfolder.
 * For Police: looks in Police/police-json-data/ (including SI/ subfolder)
 * Supports subdirectories like SI/WBP-SI-Police-2018.json
 * 
 * The wildcard captures everything after :folder/ including slashes.
 * For example: /api/questions/police/SI/WBP-SI-Police-2019.json
 * captures "SI/WBP-SI-Police-2019.json" in req.params[0]
 */
export const serveFolderPDF: RequestHandler = (req, res) => {
  const key = (req.params.folder ?? "").toLowerCase();
  const folderName = VALID_FOLDERS[key];

  if (!folderName) {
    return res.status(400).json({ error: "Invalid folder" });
  }

  // For police, look in police-json-data subdirectory; for others, use the folder directly
  const basePath = key === "police"
    ? path.join(PUBLIC_DIR, folderName, "police-json-data")
    : path.join(PUBLIC_DIR, folderName);
    
  // Extract the file path from the route parameter
  let fileName = req.params.path || "";
  
  // Decode each path segment to handle spaces and special characters
  const segments = fileName.split("/");
  const decodedSegments = segments.map(seg => decodeURIComponent(seg));
  fileName = decodedSegments.join("/");
  
  if (!fileName) {
    return res.status(400).json({ error: "File name is required" });
  }
  
  const filePath = path.join(basePath, fileName);

  // Validate path to prevent directory traversal
  const normalizedPath = path.resolve(filePath);
  const normalizedBasePath = path.resolve(basePath);
  if (!normalizedPath.startsWith(normalizedBasePath + path.sep) && normalizedPath !== normalizedBasePath) {
    console.error(`Access denied: ${normalizedPath} not in ${normalizedBasePath}`);
    return res.status(403).json({ error: "Access denied" });
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return res.status(404).json({ error: "File not found" });
  }

  try {
    const isJson = fileName.toLowerCase().endsWith(".json");
    
    if (isJson) {
      // JSON file - return as JSON
      res.setHeader("Content-Type", "application/json");
      const data = fs.readFileSync(filePath, "utf-8");
      res.send(data);
    } else {
      // PDF file - stream it
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${decodeURIComponent(fileName)}"`
      );
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    }
  } catch (err) {
    console.error("Error serving file:", err);
    res.status(500).json({ error: "Failed to serve file" });
  }
};

// Backward-compatible aliases (kept so any other imports still resolve)
export const listPoliceQuestions = listFolderQuestions;
export const servePolicePDF = serveFolderPDF;
