// Utilitaire pour les appels API backend
const API_URL = 'http://localhost:3010';  

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  if (path === '/api/user/me' && userId) {
    path = `/api/user/${userId}`;
  }
  let headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  let body = options.body;
  if (body instanceof FormData) {
    // Ne pas définir Content-Type, laisser le navigateur gérer
    // fetch utilisera automatiquement multipart/form-data avec boundary
    // headers['Content-Type'] = undefined;
  } else if (body && typeof body !== 'string') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}
