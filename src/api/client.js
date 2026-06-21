const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('spndx_token');
}

async function request(method, path, body = null) {
  const token = getToken();

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body !== null) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, opts);

  // Token expired or invalid — force logout
  if (res.status === 401) {
    localStorage.removeItem('spndx_token');
    localStorage.removeItem('spndx_user');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  // Non-JSON error responses (backend returns plain string on bad request)
  const contentType = res.headers.get('content-type') || '';
  if (!res.ok) {
    const message = contentType.includes('application/json')
      ? (await res.json()).message || 'Request failed'
      : await res.text();
    throw new Error(message || `Request failed: ${res.status}`);
  }

  // 204 No Content or empty body
  if (res.status === 204 || res.headers.get('content-length') === '0') return null;

  return contentType.includes('application/json') ? res.json() : res.text();
}

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  patch:  (path, body)  => request('PATCH',  path, body),
  delete: (path)        => request('DELETE', path),
};
