// api.js
const API_BASE = "https://shikimori.io";
const PAGE_SIZE = 50; // максимум что даёт Shikimori

export async function getGenres() {
  // получить список жанров (один запрос, кэшировать)
  if (window._genresCache) return window._genresCache;
  const url = `${API_BASE}/api/genres`;
  const resp = await fetch(url);
  const data = await resp.json();
  window._genresCache = data;
  return data;
}

export async function getCatalog({ page = 1, query = "", genres = [] } = {}) {
  let params = [
    `limit=${PAGE_SIZE}`,
    `page=${page}`,
    `order=popularity`,
    `kind=tv`,
    `season=all`
  ];
  if (query) params.push('search=' + encodeURIComponent(query.trim()));
  if (genres.length)
    params.push('genre=' + genres.join(','));
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
      genresIds: Array.isArray(a.genres) ? a.genres.map(g => g.id) : [],
      year: a.aired_on ? a.aired_on.slice(0, 4) : undefined
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
    genresIds: Array.isArray(data.genres) ? data.genres.map(g => g.id) : [],
    year: data.aired_on ? data.aired_on.slice(0, 4) : undefined
  };
}