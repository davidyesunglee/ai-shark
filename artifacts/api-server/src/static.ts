import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  console.log("[Static] Serving from:", distPath);
  console.log("[Static] Path exists:", fs.existsSync(distPath));
  
  if (!fs.existsSync(distPath)) {
    console.error("[Static] Build directory not found:", distPath);
    console.log("[Static] __dirname is:", __dirname);
    console.log("[Static] Contents of __dirname:", fs.readdirSync(__dirname));
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  console.log("[Static] Contents:", fs.readdirSync(distPath));
  
  app.use(express.static(distPath, {
    maxAge: '1d',
    etag: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
    }
  }));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.resolve(distPath, "index.html"));
  });
  
  console.log("[Static] Static file serving configured");
}
