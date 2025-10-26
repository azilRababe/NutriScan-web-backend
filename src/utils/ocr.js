import vision from "@google-cloud/vision";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyFilename =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(__dirname, "..", "google-credentials.json");

export const client = new vision.ImageAnnotatorClient({
  keyFilename,
});
