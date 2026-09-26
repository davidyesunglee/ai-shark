import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export async function parseDocument(buffer: Buffer, mimeType: string): Promise<string> {
  switch (mimeType) {
    case "application/pdf":
      return parsePDF(buffer);
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return parseDOCX(buffer);
    case "text/plain":
      return buffer.toString("utf-8");
    default:
      throw new Error(`Unsupported file type: ${mimeType}`);
  }
}

async function parsePDF(buffer: Buffer): Promise<string> {
  let parser: PDFParse | null = null;
  try {
    const uint8Array = new Uint8Array(buffer);
    parser = new PDFParse({ data: uint8Array });
    const textResult = await parser.getText();
    return textResult.text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to parse PDF file");
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch {
      }
    }
  }
}

async function parseDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error("DOCX parsing error:", error);
    throw new Error("Failed to parse DOCX file");
  }
}
