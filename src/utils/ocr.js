import vision from "@google-cloud/vision";
const client = new vision.ImageAnnotatorClient();

export const extractText = async (imageUrl) => {
  const [result] = await client.textDetection(imageUrl);
  return result.fullTextAnnotation?.text || "";
};
