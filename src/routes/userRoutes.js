import express from "express";
import { getProfile, getFavoriteScans } from "../controllers/userController.js";
import { authenticateJwt } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticateJwt, getProfile);
router.get("/favorites", authenticateJwt, getFavoriteScans);

export default router;
