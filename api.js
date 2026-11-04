// api.js
const API_BASE = "https://shikimori.io";
const PAGE_SIZE = 50;

export async function getCatalog(page = 1, { kind = "tv", search = "" } = {}) {
  let params = [
    `limit=${PAGE_SIZE}`,
    `page=${page}`,
    `order=popularity`,
    `kind=${kind}`
  ];
  if (search) params.push('search=' + encodeURIComponent(search));
  const url = `${API_BASE}/api/animes?${params.join("&")}`;
  const resp = await fetch(url);
  const data = await resp.json();

  return {
    items: data.map(a => ({
      id: a.id,
      name: a.russian || a.name,
      nameOriginal: a.name,
      poster: a.image?.preview ? (API_BASE + a.image.preview) : "",
      score: a.score,
      episodes: a.episodes,
      kind: a.kind,
      status: a.status,
      description: a.description || "",
      genres: Array.isArray(a.genres) ? a.genres.map(g => g.russian) : [],
    })),
    hasMore: data.length === PAGE_SIZE
  };
}

export async function getAnime(id) {
  const url = `${API_BASE}/api/animes/${id}`;
  const resp = await fetch(url);
  const data = await resp.json();
  return {
    id: data.id,
    name: data.russian || data.name,
    nameOriginal: data.name,
    poster: data.image?.original ? (API_BASE + data.image.original) : "",
    score: data.score,
    episodes: data.episodes,
    kind: data.kind,
    status: data.status,
    description: data.description,
    genres: Array.isArray(data.genres) ? data.genres.map(g => g.russian) : [],
  };
}