import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import axios from "axios";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { id_token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        avatar: picture,
        authProvider: "google",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (error) {
    console.error("Google mobile login error:", error);
    res.status(400).json({ error: "Invalid Google token" });
  }
});

router.post("/facebook", async (req, res) => {
  try {
    const { access_token } = req.body;
    const fbResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${access_token}`
    );
    const fbData = fbResponse.data;

    if (!fbData.email) {
      return res.status(400).json({ error: "Email permission required" });
    }

    let user = await User.findOne({ email: fbData.email });
    if (!user) {
      user = await User.create({
        email: fbData.email,
        name: fbData.name,
        avatar: fbData.picture?.data?.url,
        authProvider: "facebook",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (error) {
    console.error("Facebook mobile login error:", error);
    res.status(400).json({ error: "Invalid Facebook token" });
  }
});

export default router;
