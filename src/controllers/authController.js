import passport from "../passport.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Local login
export const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user)
      return res.status(400).json({ message: info?.message || "Login failed" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ user, token });
  })(req, res, next);
};

// logout
export const logout = (req, res, next) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// Google OAuth redirect
export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Google OAuth callback
export const googleCallback = (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false, failureRedirect: "/" },
    (err, user) => {
      if (err || !user) return res.redirect("/?error=auth_failed");

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendURL}/dashboard?token=${token}`);
    }
  )(req, res, next);
};

// Facebook OAuth redirect
export const facebookAuth = passport.authenticate("facebook", {
  scope: ["email"],
});

// Facebook OAuth callback
export const facebookCallback = (req, res, next) => {
  passport.authenticate(
    "facebook",
    { session: false, failureRedirect: "/" },
    (err, user) => {
      if (err || !user) return res.redirect("/?error=auth_failed");

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendURL}/dashboard?token=${token}`);
    }
  )(req, res, next);
};
