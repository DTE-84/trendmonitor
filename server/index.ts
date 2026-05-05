import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleScanTrends } from "../api/scan-trends";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Router for unified prefix handling
  const api = express.Router();

  api.get("/ping", (_req, res) => {
    res.json({ message: "Uplink Active", status: "Deterministic" });
  });

  api.get("/demo", handleDemo);
  api.post("/scan-trends", handleScanTrends);

  // Mount API router
  app.use("/api", api);

  // Fallback for Vercel/Netlify: also mount routes at root if prefix is stripped
  app.get("/ping", (_req, res) => res.json({ message: "Root Uplink Active" }));
  app.post("/scan-trends", handleScanTrends);

  // Extra fallback: catch all /api/ and route to handler if not caught by router
  // (Helpful if there's a mismatch in how /api is handled by the serverless host)
  app.post("/api/scan-trends", handleScanTrends);

  // Global Error Handler
  app.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error("[Global Error]:", err);
      res.status(500).json({
        error: "Internal Server Error",
        detail: err.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    },
  );

  return app;
}
