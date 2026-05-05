import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleScanTrends } from "./routes/scan-trends";

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

  // Fallback for Vercel: also mount routes at root if prefix is stripped
  app.get("/ping", (_req, res) => res.json({ message: "Root Uplink Active" }));
  app.post("/scan-trends", handleScanTrends);

  return app;
}
