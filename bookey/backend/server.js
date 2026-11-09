import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas Cloud (top-level await guarantees DB is ready)
await connectDB();

// CORS configuration (allow requests from React development origin)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy: Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parsing middleware
app.use(express.json());

// Apply General Rate Limiter (Max 100 requests per 15 minutes) to all API endpoints
app.use("/api", generalLimiter);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Health check / API Welcome endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Bookey Bookstore REST API (TD-TP 3)",
    version: "1.0.0",
    institution: "Higher National School of Advanced Technologies (ENSTA)",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        oauthToken: "POST /api/auth/oauth/token"
      },
      products: {
        getAll: "GET /api/products",
        getOne: "GET /api/products/:id",
        create: "POST /api/products (JWT required)",
        update: "PUT /api/products/:id (JWT required)",
        delete: "DELETE /api/products/:id (JWT required)"
      }
    }
  });
});

// 404 Route Handler for undefined endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Resource not found on endpoint: ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Unhandled Server Error]", err);
  res.status(err.status || 500).json({
    success: false,
    statusCode: err.status || 500,
    message: err.message || "Internal server error occurred.",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`[Bookey Backend] Server running on: http://localhost:${PORT}`);
  console.log(`[Environment] ${process.env.NODE_ENV || "development"}`);
  console.log(`[Database] MongoDB Atlas Connected successfully`);
  console.log(`[API Base] http://localhost:${PORT}/api/products`);
  console.log(`=======================================================`);
});

export default app;
