import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import videosHandler from "./api/videos.js";
import searchHandler from "./api/search.js";
import suggestHandler from "./api/suggest.js";
import commentsHandler from "./api/comments.js";

const app = express();

// Optional: serve Vite build (dist)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "dist")));


// API routes
app.get("/api/videos", (req, res) => videosHandler(req, res));
app.get("/api/search", (req, res) => searchHandler(req, res));
app.get("/api/suggest", (req, res) => suggestHandler(req, res));
app.get("/api/comments", (req, res) => commentsHandler(req, res));

// Run server
const PORT = 5001;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
