// api.js — для работы с Shikimori API

const API_BASE = "https://shikimori.io";
const PAGE_SIZE = 50;

// Получить каталог аниме по параметрам (страница, поисковый запрос, жанры)
export async function getCatalog({ page = 1, query = "", genres = [] } = {}) {
  let params = [
    `limit=${PAGE_SIZE}`,
    `page=${page}`,
    `order=popularity`,
    `kind=tv`
  ];
  if (query) params.push('search=' + encodeURIComponent(query.trim()));
  // Жанры добавляем только если есть выбранные жанры
  if (genres && genres.length > 0)
    params.push('genre=' + genres.join(','));

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
            : "osaka-logo.png", // твой логотип как заглушка
          score: a.score,
          episodes: a.episodes,
          kind: a.kind,
          status: a.status,
          description: a.description || "",
          genres: Array.isArray(a.genres)
            ? a.genres.map((g) => g.russian)
            : [],
          genresIds: Array.isArray(a.genres)
            ? a.genres.map((g) => g.id)
            : [],
          year: a.aired_on ? a.aired_on.slice(0, 4) : undefined,
        }))
      : [],
    hasMore: Array.isArray(data) && data.length === PAGE_SIZE,
  };
}

// Получить жанры для фильтрации (один раз, кэшировать не обязательно)
export async function getGenres() {
  const url = `${API_BASE}/api/genres`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error('Ошибка загрузки жанров: ' + url);
  return await resp.json();
}

// Получить инфу о тайтле по id (страница аниме)
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
      : "osaka-logo.png",
    score: data.score,
    episodes: data.episodes,
    kind: data.kind,
    status: data.status,
    description: data.description || "",
    genres: Array.isArray(data.genres)
      ? data.genres.map((g) => g.russian)
      : [],
    genresIds: Array.isArray(data.genres)
      ? data.genres.map((g) => g.id)
      : [],
    year: data.aired_on ? data.aired_on.slice(0, 4) : undefined,
  };
}
