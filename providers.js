// providers.js
function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9а-я\-]/g, "");
}

export const providers_ru = [
  {
    id: 'anilibria',
    title: 'AniLibria',
    getLink(anime) {
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'AniLibria',
        url: `https://www.anilibria.tv/search?search=${q}`,
        type: 'AniLibria'
      };
    }
  },
  {
    id: 'animego',
    title: 'AnimeGO',
    getLink(anime) {
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'AnimeGO',
        url: `https://animego.org/search/all?q=${q}`,
        type: 'AnimeGO'
      };
    }
  },
  {
    id: 'jut.su',
    title: 'Jut.su',
    getLink(anime) {
      const slug = slugify(anime.nameOriginal || anime.name);
      return {
        site: 'Jut.su',
        url: `https://jut.su/${slug}.html`,
        type: 'Jut.su'
      };
    }
  },
  {
    id: 'animedub',
    title: 'AniDub',
    getLink(anime) {
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'AniDub',
        url: `https://www.anidub.com/index.php?do=search&story=${q}`,
        type: 'AniDub'
      };
    }
  },
  {
    id: 'animevost',
    title: 'AnimeVost',
    getLink(anime) {
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'AnimeVost',
        url: `https://animevost.org/index.php?do=search&story=${q}`,
        type: 'AnimeVost'
      };
    }
  },
  {
    id: 'yummyanime',
    title: 'YummyAnime',
    getLink(anime) {
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'YummyAnime',
        url: `https://yummyanime.tv/search?search=${q}`,
        type: 'YummyAnime'
      };
    }
  },
  {
    id: 'miruro',
    title: 'MiruRo',
    getLink(anime) {
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'MiruRo',
        url: `https://miruro.ru/search?keyword=${q}`,
        type: 'Miruro'
      };
    }
  },
];

export const providers_en = [
  {
    id: 'crunchyroll',
    title: 'Crunchyroll',
    getLink(anime) {
      const q = encodeURIComponent(anime.nameOriginal || anime.name);
      return {
        site: 'Crunchyroll',
        url: `https://www.crunchyroll.com/search?q=${q}`,
        type: 'Crunchyroll'
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
        type: 'Netflix'
      };
    }
  },
];
