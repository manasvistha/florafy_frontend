const API_BASE_URL = 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    // Spread options FIRST so the merged headers below win. Otherwise a caller
    // passing `headers` (e.g. authRequest's Authorization) would replace the
    // whole object and drop Content-Type — which makes Express 5 skip body
    // parsing and leave req.body undefined on every authenticated write.
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Backend sends { message: "..." } on errors — surface that to the caller
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
}

// Same as request(), but attaches the logged-in user's JWT for protected routes.
function authRequest(path, options = {}) {
  const token = getToken();
  return request(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

/* ---------------- Auth ---------------- */

export function loginUser({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function registerUser({ name, email, password }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

// The logged-in user's own account (JWT-protected, not admin-only)
export function getMe() {
  return authRequest('/auth/me').then((d) => d.user);
}

export function updateMe(payload) {
  return authRequest('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  }).then((d) => d.user);
}

export function changePassword(payload) {
  return authRequest('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/* ---------------- Users (admin) ---------------- */

export function getUsers() {
  return authRequest('/users').then((d) => d.users);
}

export function updateUser(id, payload) {
  return authRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }).then((d) => d.user);
}

export function deleteUser(id) {
  return authRequest(`/users/${id}`, { method: 'DELETE' });
}

/* ---------------- Image upload (admin) ---------------- */

// Uploads a File to the backend and returns its public URL. Uses FormData, so
// we must NOT set Content-Type — the browser adds the multipart boundary.
export function uploadImage(file) {
  const token = getToken();
  const body = new FormData();
  body.append('image', file);

  return fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || 'Image upload failed');
    return data.url;
  });
}

/* ---------------- Products ---------------- */

export function getProducts(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/products${qs ? `?${qs}` : ''}`).then((d) => d.products);
}

export function getProduct(id) {
  return request(`/products/${id}`).then((d) => d.product);
}

export function createProduct(payload) {
  return authRequest('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((d) => d.product);
}

export function updateProduct(id, payload) {
  return authRequest(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }).then((d) => d.product);
}

export function deleteProduct(id) {
  return authRequest(`/products/${id}`, { method: 'DELETE' });
}

/* ---------------- Orders ---------------- */

// Admin: all orders, optional { status, search }
export function getOrders(params = {}) {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v));
  const qs = new URLSearchParams(clean).toString();
  return authRequest(`/orders${qs ? `?${qs}` : ''}`).then((d) => d.orders);
}

export function getOrder(id) {
  return authRequest(`/orders/${id}`).then((d) => d.order);
}

export function updateOrderStatus(id, status) {
  return authRequest(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }).then((d) => d.order);
}

// Regular user: place an order / view own history
export function createOrder(payload) {
  return authRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then((d) => d.order);
}

export function getMyOrders() {
  return authRequest('/orders/my').then((d) => d.orders);
}
