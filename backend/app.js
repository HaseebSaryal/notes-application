import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDb from "./controllers/connectDb.js";
import optionalAuth from "./middleware/optionalAuth.js";
import authRouter from "./routes/auth.js";
import router from "./router/routes.js";
import autocompleteRouter from "./routes/autocomplete.js";
import summarizeRouter from "./routes/summarize.js";
import improveRouter from "./routes/improve.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS — always enabled (dev + production)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://notes-application-one-omega.vercel.app",
      "https://notes.haseebsaryal.tech/"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(optionalAuth);

// API Routes
app.use("/api/auth", authRouter);
app.use("/api", router);
app.use("/api", autocompleteRouter);
app.use("/api", summarizeRouter);
app.use("/api", improveRouter);

// Serve static frontend files (for production)
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  // Catch-all for frontend routes (except /api)
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Connect to DB and start server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });