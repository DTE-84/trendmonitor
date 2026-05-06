import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleScanTrends } from "../api/scan-trends";

export function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const api = express.Router();

  api.get("/ping", (_req, res) => {
    res.json({ message: "Uplink Active", status: "Deterministic" });
  });

  api.get("/demo", handleDemo);
  api.post("/scan-trends", handleScanTrends);

  app.use("/api", api);

  app.get("/ping", (_req, res) => res.json({ message: "Root Uplink Active" }));

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
