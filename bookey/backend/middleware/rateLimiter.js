import rateLimit from "express-rate-limit";

// General API rate limiter: Maximum 100 requests per 15 minutes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  statusCode: 429,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests from this IP address. Please try again after 15 minutes."
  }
});

// Stricter rate limiter for Login endpoint: Maximum 5 requests per 15 minutes per client IP
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many login attempts from this IP address. Please try again after 15 minutes."
  }
});
