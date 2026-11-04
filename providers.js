// providers.js
export const providers = [
  {
    id: 'anilibria',
    title: 'AniLibria',
    async getLinks(anime) {
      const resp = await fetch(`https://api.anilibria.tv/v3/title/search?shikimori_id=${anime.id}`);
      const data = await resp.json();
      if (!data || !data.id) return [];
      if (data.player && data.player.list) {
        return [{
          label: 'AniLibria (плеер)', 
          url: `https://www.anilibria.tv/release/${data.code}.html`,
        }];
      }
      return [];
    }
  },
  {
    id: 'voidboost',
    title: 'Voidboost',
    async getLinks(anime) {
      return [{
        label: 'Voidboost (плеер)', 
        url: `https://voidboost.tv/embed/anime?shikimori_id=${anime.id}`,
      }];
    }
  }
];