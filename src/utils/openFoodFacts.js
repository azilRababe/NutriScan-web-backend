import axios from "axios";

export const fetchProductData = async (barcode) => {
  const url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;
  const { data } = await axios.get(url);
  if (data.status === 1) return data.product;
  return null;
};
