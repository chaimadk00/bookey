import express from "express";
import { registerUser, loginUser, oauthToken } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Authenticate a user and return a JWT (protected by strict 5 requests / 15m rate limit)
router.post("/login", loginLimiter, loginUser);

// OAuth 2.0 / OpenID Connect token generation endpoint for testing
router.post("/oauth/token", oauthToken);

export default router;
