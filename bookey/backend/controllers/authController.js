import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation Error: 'name', 'email', and 'password' are required fields."
      });
    }

    // 2. Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation Error: Please provide a valid email address."
      });
    }

    // 3. Validate password length
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation Error: Password must be at least 6 characters long."
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 4. Check for duplicate account in MongoDB (409 Conflict)
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: "Conflict: A user with this email address already exists."
      });
    }

    // 5. Hash the password before storing (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 6. Directly persist the new user document into MongoDB Atlas
    const savedUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash
    });

    // Return 201 Created
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "User registered successfully.",
      user: {
        id: savedUser._id.toString(),
        name: savedUser.name,
        email: savedUser.email,
        createdAt: savedUser.createdAt
      }
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "An unexpected server error occurred during registration.",
      error: error.message
    });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation Error: Please provide both 'email' and 'password'."
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 2. Find user in MongoDB by email
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid credentials: Email or password is incorrect."
      });
    }

    // 3. Verify password against stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: "Invalid credentials: Email or password is incorrect."
      });
    }

    // 4. Generate signed JWT token
    const secret = process.env.JWT_SECRET || "ensta_wamd_tp3_super_secret_jwt_key_2026";
    const userId = user._id.toString();

    const token = jwt.sign(
      {
        id: userId,
        email: user.email,
        name: user.name
      },
      secret,
      { expiresIn: "24h" }
    );

    // Return 200 OK with token and user profile
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Authentication successful.",
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "An unexpected server error occurred during authentication.",
      error: error.message
    });
  }
};

// POST /api/auth/oauth/token (OAuth 2.0 / OpenID Connect Token Endpoint for Postman Testing)
export const oauthToken = async (req, res) => {
  try {
    const { client_id } = req.body;
    const secret = process.env.JWT_SECRET || "ensta_wamd_tp3_super_secret_jwt_key_2026";

    const accessToken = jwt.sign(
      {
        sub: client_id || "ensta-oauth2-client",
        role: "admin",
        scope: "read write product:manage",
        auth_type: "oauth2"
      },
      secret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      access_token: accessToken,
      token_type: "Bearer",
      expires_in: 3600,
      scope: "read write product:manage"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "OAuth token issuance failed.",
      error: error.message
    });
  }
};
