import express from "express";
import { getProfile } from "../controllers/userController.js";
import { authenticateJwt } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticateJwt, getProfile);

export default router;
