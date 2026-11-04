// providers.js — простые ссылки по названию (поисковой странице)
export const providers = [
  {
    id: 'anilibria',
    title: 'AniLibria',
    getLink(anime) {
      // Просто поиск по названию на AniLibria
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'AniLibria',
        url: `https://www.anilibria.tv/search?search=${q}`,
        type: 'Русский'
      };
    }
  },
  {
    id: 'jutsu',
    title: 'Jut.su',
    getLink(anime) {
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'Jut.su',
        url: `https://jut.su/anime/search.html?search=${q}`,
        type: 'Русский'
      };
    }
  },
  {
    id: 'miruro',
    title: 'Miruro',
    getLink(anime) {
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'Miruro',
        url: `https://miruro.ru/search?keyword=${q}`,
        type: 'Русский'
      };
    }
  },
  {
    id: 'crunchyroll',
    title: 'Crunchyroll',
    getLink(anime) {
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'Crunchyroll',
        url: `https://www.crunchyroll.com/search?q=${q}`,
        type: 'Английский'
      };
    }
  },
  {
    id: 'netflix',
    title: 'Netflix',
    getLink(anime) {
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'Netflix',
        url: `https://www.netflix.com/search?q=${q}`,
        type: 'Английский'
      };
    }
  }
];
