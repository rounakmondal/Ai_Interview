import mammoth from "mammoth";

/**
 * Extract text from a PDF by sending it to the server-side API.
 * This avoids ALL browser Worker / MIME-type issues with pdfjs-dist.
 */
async function extractTextFromPDF(file: File): Promise<string> {
  // Read file → base64
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = btoa(binary);

  const res = await fetch("/api/extract-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: base64 }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown server error" }));
    throw new Error(err.error ?? `Server returned ${res.status}`);
  }

  const { text } = await res.json();
  if (!text || text.trim().length < 30) {
    throw new Error("Could not extract readable text. The PDF may be image-based or scanned.");
  }
  return text.trim();
}

/**
 * Extract text from a DOCX file
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

/**
 * Extract text from a DOC file (basic fallback - limited support)
 */
async function extractTextFromDOC(file: File): Promise<string> {
  // DOC files are harder to parse in the browser
  // We'll try to read as text, but this may not work well for binary DOC files
  const text = await file.text();
  
  // Try to extract readable text by filtering out binary garbage
  const cleanText = text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\xFF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  
  if (cleanText.length < 50) {
    throw new Error("Could not extract text from DOC file. Please convert to DOCX or PDF.");
  }
  
  return cleanText;
}

/**
 * Extract text from CV file (PDF, DOC, or DOCX)
 * d782dc03-e45c-45c2-881b-c1ae7d55056f
 */
export async function extractCVText(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  
  console.log(`Extracting text from ${file.name} (${extension})`);
  
  try {
    switch (extension) {
      case "pdf":
        return await extractTextFromPDF(file);
      case "docx":
        return await extractTextFromDOCX(file);
      case "doc":
        return await extractTextFromDOC(file);
      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }
  } catch (error) {
    console.error("CV extraction error:", error);
    throw error;
  }
}
