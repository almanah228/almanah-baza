import { getCatalog, getAnime } from './api.js';
import { providers } from './providers.js';

const main = document.getElementById('main');

// Начальный экран — каталог
let page = 1;
let animes = [];

function renderCatalog() {
  main.innerHTML = '<div class="catalog-list" id="catalog-list"></div><div id="loader">Загрузка...</div>';
  loadNextPage();
}
async function loadNextPage() {
  document.getElementById('loader').textContent = 'Загрузка...';
  const { items, hasMore } = await getCatalog(page);
  animes.push(...items);
  renderAnimeCards(animes);
  if (hasMore) {
    page++;
    document.getElementById('loader').innerHTML = '<button id="next-btn">Ещё</button>';
    document.getElementById('next-btn').onclick = loadNextPage;
  } else {
    document.getElementById('loader').textContent = '';
  }
}
function renderAnimeCards(list) {
  const cl = document.getElementById('catalog-list');
  cl.innerHTML = '';
  list.forEach(anime => {
    const card = document.createElement('div');
    card.className = 'anime-tile';
    card.onclick = () => showAnime(anime.id);
    card.innerHTML = `
      <img src="${anime.poster}" alt="${anime.name}" onerror="this.src='assets/osaka-logo.png'">
      <div class="tile-info">
        <div class="tile-title">${anime.name}</div>
        <div class="tile-rating">★ ${anime.score || ''}</div>
        <div class="tile-genre">${(anime.genres||[]).join(', ')}</div>
      </div>
    `;
    cl.appendChild(card);
  });
}

async function showAnime(id) {
  main.innerHTML = 'Загрузка...';
  const anime = await getAnime(id);
  main.innerHTML = `
    <div class="anime-detail">
      <img src="${anime.poster}" class="detail-poster" alt="${anime.name}" onerror="this.src='assets/osaka-logo.png'">
      <div>
        <h1>${anime.name}</h1>
        <div class="tile-rating">★ ${anime.score || ''}</div>
        <div>${anime.genres.join(', ')}</div>
        <div class="descr">${stripHTML(anime.description)}</div>
        <h2>Где смотреть:</h2>
        <div id="providers-links">Поиск...</div>
        <button class="back-btn" id="back">← Назад</button>
      </div>
    </div>
  `;
  document.getElementById('back').onclick = () => renderCatalog();
  // запросим ссылки у провайдеров
  const linksResults = await Promise.all(providers.map(p => p.getLinks(anime).catch(()=>null)));
  const block = document.getElementById('providers-links');
  block.innerHTML = '';
  linksResults.forEach((links, idx) => {
    if (links && links.length) {
      links.forEach(link => {
        // может быть "внутренний плеер", "ссылка", "iframe" и т.п.
        const a = document.createElement('a');
        a.href = link.url; a.target = '_blank'; a.textContent = link.label || providers[idx].title;
        a.className = 'provider-link';
        block.appendChild(a);
        block.appendChild(document.createElement('br'));
      });
    }
  });
}

function stripHTML(html) {
  const div = document.createElement('div'); div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

renderCatalog();