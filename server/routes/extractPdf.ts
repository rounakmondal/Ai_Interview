import { RequestHandler } from "express";

/**
 * POST /api/extract-pdf
 * Body: { data: string }  — base64-encoded PDF bytes
 * Returns: { text: string }
 *
 * Runs pdfjs-dist entirely in Node.js — no browser Worker, no MIME issues.
 */
export const handleExtractPdf: RequestHandler = async (req, res) => {
  try {
    const { data } = req.body as { data?: string };
    if (!data) {
      res.status(400).json({ error: "Missing base64 PDF data" });
      return;
    }

    // Decode base64 → Uint8Array
    const buffer = Buffer.from(data, "base64");
    const uint8 = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);

    // Use the Node.js-compatible legacy build — no worker required
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs" as any);
    // Disable worker completely in Node.js context
    pdfjsLib.GlobalWorkerOptions.workerSrc = "";

    const pdf = await pdfjsLib.getDocument({ data: uint8, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true }).promise;

    const parts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .filter((s: string) => s.trim().length > 0)
        .join(" ");
      if (pageText.trim()) parts.push(pageText);
    }

    const text = parts.join("\n\n").trim();
    if (text.length < 30) {
      res.status(422).json({ error: "Could not extract readable text. The PDF may be image-based or scanned." });
      return;
    }

    res.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("PDF extraction error:", message);
    res.status(500).json({ error: `PDF extraction failed: ${message}` });
  }
};
