import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// Use unpkg CDN worker - this is the most reliable approach for production deployments.
// Avoids all MIME type / bundler / Netlify CDN issues with local .mjs worker files.
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/**
 * Extract text from a PDF file
 */
async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const textParts: string[] = [];
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text from items, handling both 'str' and 'text' properties
      const pageText = textContent.items
        .map((item: any) => {
          // Handle both TextItem and TextMarkedContent
          if ('str' in item) {
            return item.str;
          } else if ('text' in item) {
            return item.text;
          }
          return '';
        })
        .filter((text: string) => text.trim().length > 0)
        .join(" ");
      
      if (pageText.trim()) {
        textParts.push(pageText);
      }
    }
    
    const extractedText = textParts.join("\n\n").trim();
    
    // Validate that we got meaningful content (not just metadata)
    if (extractedText.length < 50 || 
        extractedText.includes("(app.flowcv.com") ||
        extractedText.startsWith("Title (") ||
        extractedText.startsWith("Creator (") ||
        extractedText.startsWith("Producer (")) {
      throw new Error("Extracted content appears to be metadata only");
    }
    
    return extractedText;
  } catch (error) {
    console.error("PDF.js extraction failed:", error);
    throw new Error("Could not extract text from PDF. The file may be image-based or password-protected.");
  }
}

/**
 * Basic text extraction fallback
 */
async function extractTextBasic(file: File): Promise<string> {
  const text = await file.text();
  // Filter out binary garbage and extract readable text
  const cleanText = text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  
  // Extract any readable strings (basic heuristic)
  const readable = cleanText.match(/[\w\s@.,;:!?()-]{10,}/g);
  if (readable && readable.length > 0) {
    return readable.join(" ").trim();
  }
  
  throw new Error("Could not extract text from PDF. Please try a different file or format.");
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
