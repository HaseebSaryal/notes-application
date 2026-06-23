import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://notes-application-one-omega.vercel.app",
  "https://notes.haseebsaryal.tech",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// ✅ Express 5 compatible preflight handler (using regex)
// Note: CORS middleware above usually handles this automatically,
// but explicit handler ensures it works.
// If this gives error, just remove this line.

app.use(express.json());
app.use(optionalAuth);

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({
    status: "✅ Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api", router);
app.use("/api", autocompleteRouter);
app.use("/api", summarizeRouter);
app.use("/api", improveRouter);

// ✅ 404 handler (Express 5 compatible)
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: err.message || "Internal server error",
  });
});

// Connect to DB and start server
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
      console.log(`✅ CORS allowed origins:`, allowedOrigins);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });