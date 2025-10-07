import express from "express";
import { getProduct } from "../controllers/productController.js";
// import { authenticateJwt } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/:barcode", getProduct);

export default router;
