// Product data layer for the shopper-facing pages.
//
// It fetches from the backend Product API first (GET /api/products) and only
// falls back to the local catalogue in data/products.js when the API is empty
// or unreachable — so the shop keeps working (and the birthday images still
// show) whether or not the backend/DB is running and seeded.

import { getProducts as apiGetProducts, getProduct as apiGetProduct } from './api';
import { PRODUCTS as LOCAL_PRODUCTS } from '../data/products';

// Normalise both API docs (_id) and local records (id) to one shape.
function normalize(p) {
  return {
    id: p._id || p.id,
    name: p.name,
    price: p.price,
    category: p.category || 'Other',
    image: p.image,
    description: p.description || '',
    // stock may legitimately be 0; only treat missing as "unknown".
    stock: typeof p.stock === 'number' ? p.stock : null,
  };
}

// Fetch the full catalogue. Category filtering is done by the caller so a single
// fetch can back both the "View All" and per-category (e.g. Birthday) views.
export async function fetchProducts() {
  try {
    const products = await apiGetProducts();
    if (Array.isArray(products) && products.length > 0) {
      return products.map(normalize);
    }
  } catch {
    // API not available — fall through to local data.
  }
  return LOCAL_PRODUCTS.map(normalize);
}

export async function fetchProductById(id) {
  try {
    const product = await apiGetProduct(id);
    if (product) return normalize(product);
  } catch {
    // fall through to local lookup
  }
  const local = LOCAL_PRODUCTS.find((p) => String(p.id) === String(id));
  return local ? normalize(local) : null;
}
