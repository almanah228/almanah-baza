function getExternalUrl(anime, site) {
  return anime.externalLinks?.find(x => x.site === site)?.url || null;
}

export const providers_ru = [
  {
    id: 'jut.su',
    title: 'Jut.su',
    getLink(anime) {
      let url = getExternalUrl(anime, 'jut.su');
      if (url) return {site: 'Jut.su', url, type: 'Jut.su'};
      // fallback — поиск
      return {site:'Jut.su', url:`https://jut.su/search.html?query=${encodeURIComponent(anime.russian || anime.nameOriginal || anime.name)}`, type:'Jut.su'};
    }
  },
  {
    id: 'anilibria',
    title: 'AniLibria',
    async getLink(anime) {
      try {
        const resp = await fetch(`https://api.anilibria.tv/v3/title/search?shikimori_id=${anime.id}`);
        if (resp.ok) {
          const data = await resp.json();
          if (data && data.slug)
            return {
              site: 'AniLibria',
              url: `https://anilibria.tv/release/${data.slug}.html`,
              type: 'AniLibria'
            }
        }
      } catch (e) {}
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'AniLibria',
        url: `https://anilibria.tv/search?search=${q}`,
        type: 'AniLibria'
      };
    }
  },
  {
    id: 'animego',
    title: 'AnimeGO',
    getLink(anime) {
      let url = getExternalUrl(anime, 'animego');
      if (url) return {site: 'AnimeGO', url, type: 'AnimeGO'};
      return {site: 'AnimeGO', url: `https://animego.org/search/all?q=${encodeURIComponent(anime.russian || anime.nameOriginal || anime.name)}`, type: 'AnimeGO'};
    }
  },
  // Допиши другие площадки аналогично!
];

export const providers_en = [
  {
    id: 'ruro',
    title: 'RURO',
    getLink(anime) {
      let url = getExternalUrl(anime, 'ruro');
      if (url) return {site: 'RURO', url, type: 'RURO'};
      return {site: 'RURO', url: `https://ruro.me/search?q=${encodeURIComponent(anime.nameOriginal || anime.name)}`, type: 'RURO'};
    }
  }
  // Допиши еще!
];
