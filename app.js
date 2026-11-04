import { getCatalog, getAnime, getGenres } from './api.js';
import { providers_ru, providers_en } from './providers.js';

const grid = document.getElementById('anime-grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const catalogEnd = document.getElementById('catalog-end');
const genreContainer = document.getElementById('genre-container');

let page = 1, all = [], loading=false, hasMore=true, observer=null, currentQuery="", selectedGenre=null;
let genres = [];

async function renderGenres() {
  genres = await getGenres();
  genreContainer.innerHTML = genres.map(g =>
    `<button class="genre-btn${selectedGenre===g.id?' selected':''}" data-id="${g.id}">${g.russian}</button>`
  ).join('');
  genreContainer.onclick = e => {
    if (e.target.classList.contains('genre-btn')) {
      selectedGenre = +e.target.dataset.id;
      page=1; all=[]; hasMore=true; renderCatalog(true);
      renderGenres();
    }
  };
}

searchForm.onsubmit = e => {
  e.preventDefault();
  currentQuery = searchInput.value.trim();
  page = 1; all = []; hasMore = true; renderCatalog(true);
};

function createTile(anime) {
  const div = document.createElement('div'); div.className='anime-tile';
  div.innerHTML = `
    <img src="${anime.poster}" alt="${anime.name}">
    <div class="tile-title">${anime.name}</div>
    <div class="tile-rating">★ ${anime.score||''}</div>
  `;
  div.onclick = () => {
    location.hash = "anime-"+anime.id;
  };
  return div;
}

async function renderCatalog(clear=false) {
  if (loading || !hasMore) return;
  loading=true;
  if (clear) { grid.innerHTML=''; catalogEnd.innerHTML=''; }
  const {items, hasMore:more} = await getCatalog({page, query:currentQuery, genre: selectedGenre});
  all = clear ? items : all.concat(items);
  hasMore=more;
  grid.innerHTML = '';
  all.forEach(anime=>{
    grid.appendChild(createTile(anime));
  });
  if (observer) observer.disconnect();
  if (hasMore) {
    const marker = document.createElement('div'); marker.style.height='14px';
    observer = new IntersectionObserver(entries=>{
      if (entries[0].isIntersecting && !loading) {
        page++; renderCatalog();
      }
    });
    observer.observe(marker); catalogEnd.innerHTML=''; catalogEnd.appendChild(marker);
  }
  loading=false;
}

async function showAnime(id) {
  const anime = await getAnime(id);
  document.body.innerHTML = `
    <header>
      <img src="assets/logo.png" class="logo" alt="">
      <h1>Альманах База</h1>
      <button class="back-btn" onclick="window.history.back()">← Назад</button>
    </header>
    <div id="anime-detail">
      <img src="${anime.poster}" alt="">
      <h2>${anime.name}</h2>
      <div style="margin-bottom:6px;color:#798fff;opacity:.9;">★ ${anime.score||''}</div>
      <div class="descr">${stripHTML(anime.description)}</div>
      <div id="links-switch"></div>
    </div>
  `;
  let currentType = 'RU';
  let providersUsed = providers_ru;
  async function renderLinksSwitcher() {
    let markup = `
      <div style="display:flex;gap:9px;margin-bottom:12px;">
        <button id="ru-btn" class="switch-btn${currentType==='RU'?' act':''}">РУ</button>
        <button id="en-btn" class="switch-btn${currentType==='EN'?' act':''}">EN</button>
      </div>
      <div class="watch-list">`
    for(const prov of providersUsed) {
      let link = prov.getLink(anime);
      if (link instanceof Promise) link = await link;
      if (link && link.url) markup += `<a href="${link.url}" target="_blank">${prov.title}</a>`;
    }
    markup += `</div>`;
    document.getElementById('links-switch').innerHTML = markup;
    document.getElementById('ru-btn').onclick = () => { currentType = 'RU'; providersUsed = providers_ru; renderLinksSwitcher(); }
    document.getElementById('en-btn').onclick = () => { currentType = 'EN'; providersUsed = providers_en; renderLinksSwitcher(); }
  }
  renderLinksSwitcher();
}
function stripHTML(html) {
  const div = document.createElement('div'); div.innerHTML = html;
  return div.textContent || div.innerText || '';
}
function router() {
  if (location.hash.startsWith('#anime-')) {
    const id = +location.hash.replace('#anime-', '');
    showAnime(id);
  } else {
    document.body.innerHTML = `
      <header>
        <img src="assets/logo.png" class="logo" alt="Логотип"/>
        <h1>Альманах База</h1>
        <form id="search-form">
          <input id="search-input" placeholder="Поиск аниме..."/>
        </form>
      </header>
      <main>
        <div id="genre-container"></div>
        <div id="anime-grid"></div>
        <div id="catalog-end"></div>
      </main>
    `;
    window.searchForm = document.getElementById('search-form');
    window.searchInput = document.getElementById('search-input');
    window.grid = document.getElementById('anime-grid');
    window.catalogEnd = document.getElementById('catalog-end');
    window.genreContainer = document.getElementById('genre-container');
    page=1; all=[]; hasMore=true; observer=null; currentQuery=""; selectedGenre=null;
    renderGenres();
    renderCatalog(true);
    searchForm.onsubmit = e => {
      e.preventDefault();
      currentQuery = searchInput.value.trim();
      page = 1; all = []; hasMore = true; renderCatalog(true);
    };
  }
}
window.onhashchange = router;
window.onload = router;
