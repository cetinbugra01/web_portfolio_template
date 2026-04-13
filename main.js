/* ============================================
   DIS-MEKAN-CEKİMİ — main.js
   ============================================ */

const MAPBOX_TOKEN    = 'YOUR_MAPBOX_TOKEN_HERE';
const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_KEY_HERE';

/* ── CUSTOM CURSOR ── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    setTimeout(() => {
      ring.style.left = e.clientX + 'px';
      ring.style.top  = e.clientY + 'px';
    }, 80);
  });
}

/* ── NAV SCROLL ── */
function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

/* ── HAMBURGER MENÜ ── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ── SCROLL REVEAL ── */
function initReveal() {
  const reveals  = document.querySelectorAll('.reveal');
  if (!reveals.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => observer.observe(el));
}

/* ── MAPBOX HARİTA ── */
function initMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  if (typeof mapboxgl === 'undefined') {
    mapContainer.innerHTML = `<div style="padding:40px;text-align:center;color:#c04040;font-family:monospace;font-size:12px;">Mapbox kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol edin.</div>`;
    return;
  }

  if (MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN_HERE') {
    mapContainer.innerHTML = `
      <div style="padding:60px;text-align:center;color:var(--text,#c8c0b4);font-family:monospace;font-size:11px;background:#1c1c1c;border:1px solid #2a2a2a;height:500px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;">
        <span style="font-size:40px">🗺</span>
        <b style="color:#d4a843;letter-spacing:0.15em">MAPBOX_TOKEN gerekli</b>
        <span>main.js dosyasından API anahtarınızı girin.</span>
      </div>`;
    return;
  }

  try {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [32.8597, 39.9334],
      zoom: 12
    });
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  } catch (err) {
    console.error('Harita yüklenirken hata:', err);
  }
}

/* ── BAŞLAT ── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initHamburger();
  initReveal();
  initMap();
});
