// providers.js
// Преобразовать имена для разных сайтов (юникод в латиницу)
function slugName(anime) {
  // удаляем все не латиницу/цифры/нижнее подчёркивание
  return (anime.nameOriginal || "").replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
}

export const providers = [
  {
    id: 'anilibria',
    title: 'AniLibria',
    type: 'RuSite',
    async getLink(anime) {
      // найти релиз по shikimori_id
      const resp = await fetch(`https://api.anilibria.tv/v3/title/search?shikimori_id=${anime.id}`);
      const data = await resp.json();
      if (!data || !data.code) return null;
      return {
        site: 'AniLibria',
        url: `https://www.anilibria.tv/release/${data.code}.html`,
        type: 'RuSite'
      };
    }
  },
  {
    id: 'jutsu',
    title: 'Jut.su',
    type: 'RuSite',
    async getLink(anime) {
      // Jut.su использует транслитированное название для url
      // Если нет рус-имени (например, для нерусских сериалов) — не даём ссылку
      if (!anime.nameOriginal) return null;
      return {
        site: 'Jut.su',
        url: `https://jut.su/${slugName(anime)}/`,
        type: 'RuSite'
      };
    }
  },
  {
    id: 'miruro',
    title: 'Miruro.to',
    type: 'EngSite',
    async getLink(anime) {
      // Miruro — по shikimori id: https://miruro.to/anime/shikimori_{id}
      return {
        site: 'Miruro.to',
        url: `https://miruro.to/anime/shikimori_${anime.id}`,
        type: 'EngSite'
      };
    }
  },
  {
    id: 'crunchyroll',
    title: 'Crunchyroll',
    type: 'EngSite',
    async getLink(anime) {
      // нет явных id, поэтому даём deep link на поиск
      return {
        site: 'Crunchyroll',
        url: `https://www.crunchyroll.com/search?q=${encodeURIComponent(anime.nameOriginal)}`,
        type: 'EngSite'
      };
    }
  },
  {
    id: 'netflix',
    title: 'Netflix',
    type: 'EngSite',
    async getLink(anime) {
      return {
        site: 'Netflix',
        url: `https://www.netflix.com/search?q=${encodeURIComponent(anime.nameOriginal)}`,
        type: 'EngSite'
      };
    }
  }
];