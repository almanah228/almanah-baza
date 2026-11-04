export async function getCatalog({ page = 1, query = "", genres = [] } = {}) {
  let params = [
    `limit=${PAGE_SIZE}`,
    `page=${page}`,
    `order=popularity`,
    `kind=tv`
  ];
  if (query) params.push('search=' + encodeURIComponent(query.trim()));
  // ВАЖНО: genres добавлять ТОЛЬКО когда реально что-то выбрано
  if (genres && genres.length > 0)
    params.push('genre=' + genres.join(','));

  const url = `${API_BASE}/api/animes?${params.join("&")}`; // url собирается ОДИН РАЗ после сбора параметров
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
