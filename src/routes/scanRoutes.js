import express from "express";
import { toggleFavorite } from "../controllers/scanController.js";
import { authenticateJwt } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.patch("/:id/favorite", authenticateJwt, toggleFavorite);

export default router;
