// Camada unica que fala com o back-end. Todo componente que precisa de dados
// chama uma funcao daqui em vez de usar fetch direto. Cada funcao devolve o
// JSON pronto ou lanca um erro com a mensagem que veio da API.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3333";

// monta o header com o token quando o usuario esta logado
function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// transforma uma resposta de erro da API em Error com a mensagem certa
async function parseError(res, fallback) {
  const body = await res.json().catch(() => ({}));
  throw new Error(body.error || fallback);
}

export async function getAlbumsByMonth(month, token) {
  const res = await fetch(`${API_URL}/api/albums?month=${month}`, {
    headers: authHeaders(token),
  });

  if (!res.ok) return parseError(res, "Nao foi possivel buscar os albuns.");
  return res.json();
}

export async function createAlbum(album, token) {
  const res = await fetch(`${API_URL}/api/albums`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify(album),
  });

  if (!res.ok) return parseError(res, "Nao foi possivel cadastrar o album.");
  return res.json();
}

export async function signup(data) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) return parseError(res, "Nao foi possivel criar a conta.");
  return res.json();
}

export async function login(data) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) return parseError(res, "Nao foi possivel entrar.");
  return res.json();
}

export async function toggleFavorite(albumId, token) {
  const res = await fetch(`${API_URL}/api/favorites/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ albumId }),
  });

  if (!res.ok) return parseError(res, "Nao foi possivel favoritar o album.");
  return res.json();
}

export async function getFavorites(token) {
  const res = await fetch(`${API_URL}/api/favorites`, {
    headers: authHeaders(token),
  });

  if (!res.ok) return parseError(res, "Nao foi possivel buscar os favoritos.");
  return res.json();
}
