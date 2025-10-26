import express from "express";
import { getProduct, scanImage } from "../controllers/productController.js";
import { authenticateJwt } from "../middlewares/authMiddleware.js";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

const router = express.Router();

router.get("/:barcode", authenticateJwt, getProduct);
router.post("/ocr", authenticateJwt, upload.single("image"), scanImage);

export default router;
