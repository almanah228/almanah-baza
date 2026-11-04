import { getCatalog, getAnime, getGenres } from './api.js';
import { providers } from './providers.js';

const main = document.getElementById('main-content');
const genrePanel = document.getElementById('genre-panel');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

let genresList = [];
let selectedGenres = [];
let query = "";
let page = 1;
let allAnimes = [];
let hasMore = true;
let loading = false;
let observer = null;

// ==== Жанры как на шики ====
async function setupGenres() {
  genresList = await getGenres();
  genrePanel.innerHTML = '';
  genresList.forEach(g => {
    const chip = document.createElement('button');
    chip.className = 'genre-chip' + (selectedGenres.includes(g.id) ? ' selected' : '');
    chip.textContent = g.russian;
    chip.onclick = () => {
      if (selectedGenres.includes(g.id)) {
        selectedGenres = selectedGenres.filter(id => id !== g.id);
      } else {
        selectedGenres.push(g.id);
      }
      renderCatalog(true);
    };
    genrePanel.appendChild(chip);
  });
  // кнопка сброса справа
  const reset = document.createElement('button');
  reset.className = 'genre-chip';
  reset.textContent = 'Сбросить';
  reset.onclick = () => { selectedGenres = []; renderCatalog(true); };
  genrePanel.appendChild(reset);
}

async function renderCatalog(clear = false) {
  if (loading) return;
  loading = true;
  if (clear) {
    allAnimes = [];
    page = 1;
    main.innerHTML = `<div class="anime-grid" id="anime-grid"></div>`;
    document.getElementById('anime-grid').innerHTML = skeletonGrid();
  }
  const grid = document.getElementById('anime-grid') || document.createElement('div');
  const { items, hasMore:more } = await getCatalog({page, query, genres:selectedGenres});
  allAnimes = clear ? items : allAnimes.concat(items);
  hasMore = more;
  grid.innerHTML = '';
  allAnimes.forEach(anime => grid.appendChild(animeTile(anime)));
  if (!grid.parentElement) main.appendChild(grid);
  // бесконечная прокрутка
  if (observer) observer.disconnect();
  if (hasMore) {
    const marker = document.createElement('div'); marker.style.height='32px';
    observer = new IntersectionObserver(entries=>{
      if (entries[0].isIntersecting && !loading) {
        page++; renderCatalog();
      }
    });
    observer.observe(marker);
    grid.appendChild(marker);
  }
  loading = false;
}

function skeletonGrid() {
  return Array(8).fill(0).map(()=>`<div class="anime-tile skeleton"></div>`).join('');
}

function animeTile(anime) {
  const div = document.createElement('div');
  div.className = 'anime-tile';
  div.onclick = () => showAnime(anime.id);
  div.innerHTML = `
    <img src="${anime.poster}" class="anime-poster" alt="${anime.name}" onerror="this.src='assets/osaka-logo.png'">
    <div class="tile-info">
      <div class="tile-title">${anime.name}</div>
      <div class="tile-rating">★ ${anime.score || ''}</div>
      <div class="tile-genre">${anime.genres.join(', ')}</div>
    </div>
  `;
  return div;
}

async function showAnime(id) {
  main.innerHTML = `
    <div class="anime-detail"><div style="width:235px"></div>
    <div class="detail-info">Загрузка...</div></div>`;
  const anime = await getAnime(id);
  // Ссылки "где смотреть"
  const links = await Promise.all(providers.map(p=>p.getLink(anime)));
  const filtered = links.filter(Boolean);
  // Genres
  const genresHTML = anime.genres.map(g=>`<span class="genre-chip selected" style="pointer-events:none;margin-right:5px;margin-bottom:4px;">${g}</span>`).join('');
  main.innerHTML = `
    <div class="anime-detail">
      <img src="${anime.poster}" class="detail-poster" alt="${anime.name}" onerror="this.src='assets/osaka-logo.png'">
      <div class="detail-info">
        <div class="detail-title">${anime.name}</div>
        <div class="detail-rating">★ ${anime.score || ''} · ${anime.episodes} эп.</div>
        <div class="detail-genres">${genresHTML}</div>
        <div class="detail-desc">${stripHTML(anime.description)}</div>
        <div class="watch-block"><b>Где смотреть:</b>
          <div class="watch-list">${
            filtered.length ? filtered.map(link => `
              <a href="${link.url}" class="watch-link" target="_blank" rel="noopener">
                <span class="watch-site">${link.site}</span>
                <span class="watch-type">[${link.type}]</span>
                <span class="watch-btn">Перейти</span>
              </a>
            `).join('') : '<div style="color:#e44;">Нет подходящих сайтов</div>'
          }</div>
        </div>
        <button class="watch-btn" style="margin-top:27px;" onclick="location.reload()">← К каталогу</button>
      </div>
    </div>
  `;
}

function stripHTML(html) {
  const div = document.createElement('div'); div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

searchForm.onsubmit = e => {
  e.preventDefault();
  query = searchInput.value || "";
  renderCatalog(true);
};
searchInput.oninput = e => {
  if (!searchInput.value) { query = ""; renderCatalog(true);}
};

window.onload = async () => {
  await setupGenres();
  renderCatalog(true);
};