import { getCatalog, getAnime } from './api.js';
import { providers_ru, providers_en } from './providers.js';

const grid = document.getElementById('anime-grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const catalogEnd = document.getElementById('catalog-end');
const modal = document.getElementById('modal-detail');
let page = 1, all = [], loading=false, hasMore=true, observer=null, currentQuery="";

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
  div.onclick = () => showAnime(anime.id);
  return div;
}

async function renderCatalog(clear=false) {
  if (loading || !hasMore) return;
  loading=true;
  if (clear) { grid.innerHTML=''; catalogEnd.innerHTML=''; }
  const {items, hasMore:more} = await getCatalog({page, query:currentQuery});
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
  modal.style.display='flex';
  modal.innerHTML = `<div class="anime-detail">Загрузка...<button class="close-detail">&times;</button></div>`;
  try {
    const anime = await getAnime(id);

    let currentType = 'RU';
    let providersUsed = providers_ru;

    function renderLinksSwitcher() {
      return `
      <div style="display:flex;gap:9px;margin-bottom:10px;">
        <button id="ru-btn" class="switch-btn${currentType==='RU'?' act':''}">РУ</button>
        <button id="en-btn" class="switch-btn${currentType==='EN'?' act':''}">EN</button>
      </div>
      <div class="watch-list">
        ${providersUsed.map(linkP => {
          const link = linkP.getLink(anime);
          return `<a href="${link.url}" target="_blank" rel="noopener">${link.site}</a>`;
        }).join('')}
      </div>
      `;
    }
    modal.innerHTML = `
      <div class="anime-detail">
        <button class="close-detail">&times;</button>
        <img src="${anime.poster}" alt="">
        <h1>${anime.name}</h1>
        <div class="descr">${stripHTML(anime.description)}</div>
        <div id="links-switch">
          ${renderLinksSwitcher()}
        </div>
      </div>`;
    const $switchBlock = modal.querySelector('#links-switch');
    modal.querySelector('.close-detail').onclick = ()=> {modal.style.display='none';};
    function setHandlers() {
      if ($switchBlock) {
        if (modal.querySelector('#ru-btn'))
          modal.querySelector('#ru-btn').onclick = () => {
            currentType = 'RU'; providersUsed = providers_ru;
            $switchBlock.innerHTML = renderLinksSwitcher(); setHandlers();
          }
        if (modal.querySelector('#en-btn'))
          modal.querySelector('#en-btn').onclick = () => {
            currentType = 'EN'; providersUsed = providers_en;
            $switchBlock.innerHTML = renderLinksSwitcher(); setHandlers();
          }
      }
    }
    setHandlers();
  } catch(err) {
    modal.innerHTML = `<div class="anime-detail">
      <button class="close-detail">&times;</button>
      <div style="color:#b44;margin:14px 0;">Ошибка загрузки данных об аниме.</div>
    </div>`;
    modal.querySelector('.close-detail').onclick = ()=> {modal.style.display='none';};
  }
}
function stripHTML(html) {
  const div = document.createElement('div'); div.innerHTML = html;
  return div.textContent || div.innerText || '';
}
window.onload = () => { renderCatalog(true);}