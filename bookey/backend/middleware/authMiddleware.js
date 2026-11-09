import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization header is missing. Access denied."
    });
  }

  // Token must follow format: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format. Format must be: Bearer <token>"
    });
  }

  const token = parts[1];
  const secret = process.env.JWT_SECRET || "bookey_jwt_secret_key_2026";

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Unauthorized access.",
      error: error.message
    });
  }
};
