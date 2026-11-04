// providers.js
function slugName(anime) {
  // только буквы/цифры для jut.su (можно доработать транслит)
  return (anime.nameOriginal || "").replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
}
export const providers = [
  {
  id: 'anilibria',
  title: 'AniLibria',
  type: 'RuSite',
  async getLink(anime) {
    try {
      const resp = await fetch(
        `https://api.anilibria.tv/v3/title/search?shikimori_id=${anime.id}`
      );
      if (!resp.ok) return null;
      const data = await resp.json();
      if (!data || !data.code) return null;
      return {
        site: 'AniLibria',
        url: `https://www.anilibria.tv/release/${data.code}.html`,
        type: 'RuSite'
      };
    } catch {
      return null;
    }
  }
},
  {
    id: 'jutsu',
    title: 'Jut.su',
    type: 'RuSite',
    async getLink(anime) {
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
