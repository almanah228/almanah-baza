const API_BASE = "https://shikimori.io";
const PAGE_SIZE = 40;

export async function getCatalog({ page = 1, query = "" } = {}) {
  let params = [
    `limit=${PAGE_SIZE}`,
    `page=${page}`,
    `order=popularity`,
    `kind=tv`
  ];
  if (query) params.push('search=' + encodeURIComponent(query.trim()));

  const url = `${API_BASE}/api/animes?${params.join("&")}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    console.log('Ошибка запроса к Shikimori API:', resp.status, url);
    return { items: [], hasMore: false };
  }
  const data = await resp.json();

  return {
    items: Array.isArray(data)
      ? data.map(a => ({
          id: a.id,
          name: a.russian || a.name,
          nameOriginal: a.name,
          poster: a.image?.preview
            ? API_BASE + a.image.preview
            : "assets/osaka-logo.png",
          score: a.score,
        }))
      : [],
    hasMore: Array.isArray(data) && data.length === PAGE_SIZE,
  };
}

export async function getAnime(id) {
  const url = `${API_BASE}/api/animes/${id}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Ошибка получения аниме: ' + url);
  const data = await resp.json();
  return {
    id: data.id,
    name: data.russian || data.name,
    nameOriginal: data.name,
    poster: data.image?.original
      ? API_BASE + data.image.original
      : "assets/osaka-logo.png",
    score: data.score,
    episodes: data.episodes,
    description: data.description || "",
  };
}
