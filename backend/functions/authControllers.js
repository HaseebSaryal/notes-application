import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "notes-app-secret";

const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({
      success: false,
      msg: "Username and password are required",
    });
  }

  try {
    const normalizedUsername = username.trim().toLowerCase();
    const existingUser = await User.findOne({ username: normalizedUsername });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        msg: "Username is already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: normalizedUsername,
      password: hashedPassword,
    });

    const token = createToken(user);

    res.status(201).json({
      success: true,
      msg: "Registration successful",
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({
      success: false,
      msg: "Username and password are required",
    });
  }

  try {
    const normalizedUsername = username.trim().toLowerCase();
    const user = await User.findOne({ username: normalizedUsername });

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid username or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        msg: "Invalid username or password",
      });
    }

    const token = createToken(user);

    res.status(200).json({
      success: true,
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Internal server error",
      error: error.message,
    });
  }
};

export { register, login };