import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo.js";

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

  app.use("/api", api);

  app.get("/ping", (_req, res) => res.json({ message: "Root Uplink Active" }));

  app.use(
    (
      err: any,
      _req: Request,
      res: Response,
      _next: NextFunction,
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
