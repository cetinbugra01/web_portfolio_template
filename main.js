/* ============================================
   DIS-MEKAN-CEKİMİ — main.js
   ============================================ */

const MAPBOX_TOKEN   = 'YOUR_MAPBOX_TOKEN_HERE';
const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_KEY_HERE';

/* ── NAVIGATION & SCROLL ── */
function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });
}

/* ── HAMBURGER MENÜ ── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }
}

/* ── MAPBOX HARİTA KONTROLÜ ── */
function initMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  if (typeof mapboxgl === 'undefined') {
    mapContainer.innerHTML = `<div style="padding:20px; color:#c04040;">Mapbox kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol edin veya HTML'deki script linklerini doğrulayın.</div>`;
    return;
  }

  if (MAPBOX_TOKEN === 'YOUR_MAPBOX_TOKEN_HERE') {
    mapContainer.innerHTML = `<div style="padding:40px; text-align:center; color:#c8c0b4; border:1px solid #2a2a2a;">
      <span style="font-size:30px">🗺</span><br><br>
      Harita için <b>MAPBOX_TOKEN</b> gerekli.<br>
      Lütfen main.js dosyasından API anahtarınızı girin.
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
    console.error("Harita yüklenirken hata:", err);
  }
}

/* ── TÜM FONKSİYONLARI BAŞLAT ── */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHamburger();
  
  if (document.getElementById('map')) {
    initMap();
  }
});
