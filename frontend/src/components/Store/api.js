import axios from "axios";
import BACKEND_URL from "../../config";

export async function fetchProducts(count = 80) {
  const res = await axios.get(`${BACKEND_URL}/store/products?count=${count}`);
  return Array.isArray(res.data) ? res.data : res.data.products || [];
}

export async function fetchProductById(id) {
  const res = await axios.get(
    `${BACKEND_URL}/store/products/${encodeURIComponent(id)}`
  );
  return res.data || null;
}
