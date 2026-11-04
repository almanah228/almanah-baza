const API_BASE = "https://shikimori.io";
const PAGE_SIZE = 40;

// Картинка-заглушка (любой твой файл в папке assets)
const DEFAULT_IMAGE = "assets/logo.png";

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

  const items = (Array.isArray(data) ? data : []).map(a => {
    let poster = a.image?.preview
      ? API_BASE + a.image.preview
      : DEFAULT_IMAGE;
    if (/404|notfound|noimage|plug|blank/i.test(poster)) poster = DEFAULT_IMAGE;
    return {
      id: a.id,
      name: a.russian || a.name,
      nameOriginal: a.name,
      poster,
      score: a.score,
    }
  });

  return {
    items,
    hasMore: Array.isArray(data) && data.length === PAGE_SIZE,
  };
}

export async function getAnime(id) {
  const url = `${API_BASE}/api/animes/${id}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Ошибка получения аниме: ' + url);
  const data = await resp.json();

  let poster = data.image?.original
    ? API_BASE + data.image.original
    : DEFAULT_IMAGE;
  if (/404|notfound|noimage|plug|blank/i.test(poster)) poster = DEFAULT_IMAGE;
  return {
    id: data.id,
    name: data.russian || data.name,
    nameOriginal: data.name,
    poster,
    score: data.score,
    episodes: data.episodes,
    description: data.description || "",
  };
}