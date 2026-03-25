import { RequestHandler } from "express";
import path from "path";
import fs from "fs";

const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Whitelist: maps lowercase route key → actual subfolder name under public/ */
const VALID_FOLDERS: Record<string, string> = {
  police: "Police",
  wbcs: "WBCS",
  ssc: "SSC",
};

/**
 * GET /api/questions/:folder
 * Returns list of PDF files from the requested public subfolder.
 * Returns empty array when the folder doesn't exist yet (graceful).
 */
export const listFolderQuestions: RequestHandler = (req, res) => {
  const key = (req.params.folder ?? "").toLowerCase();
  const folderName = VALID_FOLDERS[key];

  if (!folderName) {
    return res.status(400).json({ error: "Invalid folder" });
  }

  const folderPath = path.join(PUBLIC_DIR, folderName);

  if (!fs.existsSync(folderPath)) {
    return res.json({ success: true, folder: folderName, count: 0, files: [] });
  }

  try {
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => f.toLowerCase().endsWith(".pdf"));

    const filesList = files.map((file) => ({
      name: file,
      path: `/${folderName}/${encodeURIComponent(file)}`,
      size: fs.statSync(path.join(folderPath, file)).size,
    }));

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
 * GET /api/questions/:folder/:fileName
 * Serves a PDF directly from the whitelisted public subfolder.
 */
export const serveFolderPDF: RequestHandler = (req, res) => {
  const key = (req.params.folder ?? "").toLowerCase();
  const folderName = VALID_FOLDERS[key];

  if (!folderName) {
    return res.status(400).json({ error: "Invalid folder" });
  }

  const folderPath = path.join(PUBLIC_DIR, folderName);
  const fileName = req.params.fileName;
  const filePath = path.join(folderPath, fileName);

  // Validate path to prevent directory traversal
  const normalizedPath = path.normalize(filePath);
  if (!normalizedPath.startsWith(folderPath)) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  try {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${decodeURIComponent(fileName)}"`
    );
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    console.error("Error serving PDF:", err);
    res.status(500).json({ error: "Failed to serve PDF" });
  }
};

// Backward-compatible aliases (kept so any other imports still resolve)
export const listPoliceQuestions = listFolderQuestions;
export const servePolicePDF = serveFolderPDF;
