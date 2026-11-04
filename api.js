// api.js

const API_BASE = "https://shikimori.io";
const PAGE_SIZE = 50;

export async function getCatalog({ page = 1, query = "", genres = [] } = {}) {
  let params = [
    `limit=${PAGE_SIZE}`,
    `page=${page}`,
    `order=popularity`,
    `kind=tv`
  ];
  if (query) params.push('search=' + encodeURIComponent(query.trim()));
  // ДОБАВЛЯЕМ genre=... ТОЛЬКО если выбран жанр!
  if (genres && genres.length)
    params.push('genre=' + genres.join(','));
  const url = `${API_BASE}/api/animes?${params.join("&")}`;
  const resp = await fetch(url);

  if (!resp.ok) throw new Error('Ошибка получения каталога: ' + url);

  const data = await resp.json();

  return {
    items: data.map(a => ({
      id: a.id,
      name: a.russian || a.name,
      nameOriginal: a.name,
      poster: a.image?.preview ? (API_BASE + a.image.preview) : "assets/osaka-logo.png",
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
