function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[ /]+/g, "-")
    .replace(/[^a-z0-9а-я\-]/g, "");
}

export const providers_ru = [
  {
    id: 'jut.su',
    title: 'Jut.su',
    getLink(anime) {
      if (anime.externalLinks) {
        const ext = anime.externalLinks.find(x=>x.site==='jut.su');
        if (ext) return {site:'Jut.su', url:ext.url, type:'Jut.su'};
      }
      const slug = slugify(anime.russian || anime.nameOriginal || anime.name);
      return {site:'Jut.su', url:`https://jut.su/${slug}.html`, type:'Jut.su'};
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
          if (data && data.code)
            return {
              site: 'AniLibria',
              url: `https://www.anilibria.tv/release/${data.code}.html`,
              type: 'AniLibria'
            }
        }
      } catch (e) {}
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'AniLibria',
        url: `https://www.anilibria.tv/search?search=${q}`,
        type: 'AniLibria'
      };
    }
  },
  // ... (добавь другие провайдеры-аналогично: YummyAnime, AniDub, AnimeGO, Miru, ...)
];

// ENGLISH
export const providers_en = [
  {
    id: 'ruro',
    title: 'RURO',
    getLink(anime) {
      // RURO на английском: либо externalLink c site='ruro', либо поиск
      if (anime.externalLinks) {
        const ext = anime.externalLinks.find(x=>x.site==='ruro');
        if (ext) return {site:'RURO', url:ext.url, type:'RURO'};
      }
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {site:'RURO', url:`https://ruro.me/search?q=${q}`, type:'RURO'};
    }
  },
  // ... (Crunchyroll, Netflix, Funimation, ...)
];
