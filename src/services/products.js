// Product data layer for the shopper-facing pages. The backend Product API
// (managed by the Admin panel) is the single source of truth — there is no
// local/hardcoded fallback, so every page always reflects the live database.

import { getProducts as apiGetProducts, getProduct as apiGetProduct } from './api';

// Normalise API docs so pages can rely on `id` (rather than `_id`).
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
    buildable: !!p.buildable,
  };
}

// Fetch the whole catalogue. Category/search filtering is done by callers so a
// single fetch backs the Shop, Dashboard, Build Bouquet, search and filters.
export async function fetchProducts() {
  const products = await apiGetProducts();
  return Array.isArray(products) ? products.map(normalize) : [];
}

export async function fetchProductById(id) {
  const product = await apiGetProduct(id);
  return product ? normalize(product) : null;
}
