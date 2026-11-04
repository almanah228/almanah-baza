const API_BASE = "https://shikimori.io";
const PAGE_SIZE = 40;
const DEFAULT_IMAGE = "assets/logo.png";

export async function getGenres() {
  const r = await fetch('https://shikimori.one/api/genres');
  if (!r.ok) return [];
  return await r.json();
}
export async function getExternalLinks(id) {
  const r = await fetch(`${API_BASE}/api/animes/${id}/external_links`);
  if (!r.ok) return [];
  return await r.json();
}
export async function getCatalog({ page = 1, query = "", genre = null } = {}) {
  let params = [
    `limit=${PAGE_SIZE}`,
    `page=${page}`,
    `order=popularity`,
    `kind=tv`
  ];
  if (query) params.push('search=' + encodeURIComponent(query.trim()));
  if (genre) params.push('genre=' + genre);

  const url = `${API_BASE}/api/animes?${params.join("&")}`;
  const resp = await fetch(url);
  if (!resp.ok) return { items: [], hasMore: false };
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
      score: a.score
    }
  });
  return { items, hasMore: Array.isArray(data)&&data.length===PAGE_SIZE };
}
export async function getAnime(id) {
  const [animeInfo, externalLinks] = await Promise.all([
    fetch(`${API_BASE}/api/animes/${id}`).then(r=>r.json()),
    getExternalLinks(id)
  ]);
  let poster = animeInfo.image?.original
    ? API_BASE + animeInfo.image.original
    : DEFAULT_IMAGE;
  if (/404|notfound|noimage|plug|blank/i.test(poster)) poster = DEFAULT_IMAGE;
  return {
    id: animeInfo.id,
    name: animeInfo.russian || animeInfo.name,
    nameOriginal: animeInfo.name,
    poster,
    score: animeInfo.score,
    episodes: animeInfo.episodes,
    description: animeInfo.description || "",
    externalLinks
  };
}
