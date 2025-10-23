import express from "express";
import {
  login,
  googleAuth,
  googleCallback,
  facebookAuth,
  facebookCallback,
  register,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

// User registration
router.post("/register", register);

// Local login
router.post("/login", login);

// logout
router.post("/logout", logout);

// Google OAuth
router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

// Facebook OAuth
router.get("/facebook", facebookAuth);
router.get("/facebook/callback", facebookCallback);

export default router;
