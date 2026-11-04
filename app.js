import { getCatalog, getAnime, getGenres } from './api.js';
import { providers } from './providers.js';

let genresCache = [], selectedGenres = [], currentQuery = "";
const grid = document.getElementById('anime-grid');
const genrePanel = document.getElementById('genre-panel');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const catalogEnd = document.getElementById('catalog-end');
const modal = document.getElementById('modal-detail');
let page = 1, all = [], loading=false, hasMore=true, observer=null;

async function loadGenres() {
  genresCache = await getGenres();
  genrePanel.innerHTML = '';
  genresCache.forEach(g => {
    const btn = document.createElement('button');
    btn.textContent = g.russian;
    btn.className = selectedGenres.includes(g.id) ? 'genre-btn selected' : 'genre-btn';
    btn.onclick = () => {
      selectedGenres = selectedGenres.includes(g.id)
        ? selectedGenres.filter(id=>id!==g.id)
        : selectedGenres.concat([g.id]);
      page=1; all=[]; hasMore=true; renderCatalog(true);
      loadGenres();
    };
    genrePanel.appendChild(btn);
  });
}
document.getElementById('genres-reset').onclick = () => {
  selectedGenres = []; page=1; all=[]; hasMore=true; renderCatalog(true);
  loadGenres();
};

searchForm.onsubmit = e => {
  e.preventDefault();
  currentQuery = searchInput.value.trim();
  page = 1; all=[]; hasMore=true; renderCatalog(true);
};
searchInput.oninput = e => {
  if (searchInput.value==='') {
    currentQuery = "";
    page=1; all=[]; hasMore=true; renderCatalog(true);
  }
};

async function renderCatalog(clear=false) {
  if (loading || !hasMore) return;
  loading=true;
  if (clear) { grid.innerHTML=''; catalogEnd.innerHTML=''; }
  const {items, hasMore:more} = await getCatalog({page, query:currentQuery, genres:selectedGenres});
  all = clear ? items : all.concat(items);
  hasMore=more;
  grid.innerHTML = '';
  all.forEach(anime=>{
    grid.appendChild(createTile(anime));
  });
  if (observer) observer.disconnect();
  if (hasMore) {
    const marker = document.createElement('div'); marker.style.height='15px';
    observer = new IntersectionObserver(entries=>{
      if (entries[0].isIntersecting && !loading) {
        page++; renderCatalog();
      }
    });
    observer.observe(marker); catalogEnd.innerHTML=''; catalogEnd.appendChild(marker);
  }
  loading=false;
}
function createTile(anime) {
  const div = document.createElement('div'); div.className='anime-tile';
  div.innerHTML = `
    <img src="${anime.poster}" alt="${anime.name}" onerror="this.src='osaka-logo.png'">
    <div class="tile-title">${anime.name}</div>
    <div class="tile-rating">★ ${anime.score||''}</div>
    <div class="tile-genre">${anime.genres.join(', ')}</div>
  `;
  div.onclick = ()=>showAnime(anime.id);
  return div;
}
async function showAnime(id) {
  modal.style.display='flex';
  modal.innerHTML = `<div class="anime-detail">Загрузка...<button class="close-detail">&times;</button></div>`;
  try {
    const anime = await getAnime(id);
    const links = (await Promise.all(providers.map(p=>p.getLink(anime)))).filter(Boolean);

    modal.innerHTML = `
      <div class="anime-detail">
        <button class="close-detail">&times;</button>
        <img src="${anime.poster}" alt="">
        <h1>${anime.name}</h1>
        <div class="rating">★ ${anime.score||''} | ${anime.episodes} эп.</div>
        <div class="genres">${anime.genres.join(', ')}</div>
        <div class="descr">${stripHTML(anime.description)}</div>
        <div class="watch-block">
          <b>Где смотреть:</b>
          <div class="watch-list">
          ${links.length ? links.map(link=>
            `<a href="${link.url}" target="_blank" rel="noopener">${link.site} [${link.type}]</a>`).join('')
            : '<div style="color:#b44;padding:8px 0;">Нет сайтов для просмотра</div>'}
          </div>
        </div>
      </div>`;
    modal.querySelector('.close-detail').onclick = ()=> {modal.style.display='none';};
  } catch(err) {
    modal.innerHTML = `<div class="anime-detail">
      <button class="close-detail">&times;</button>
      <div style="color:#b44;margin:14px 0;">Ошибка загрузки данных о аниме.</div>
    </div>`;
    modal.querySelector('.close-detail').onclick = ()=> {modal.style.display='none';};
  }
}
function stripHTML(html) {
  const div = document.createElement('div'); div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

window.onload = async () => { await loadGenres(); renderCatalog(true);}
