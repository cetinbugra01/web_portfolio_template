
/* ============================================
   DIS-MEKAN-CEKİMİ — main.js
   ============================================ */

/* ── API KEYS (buraya kendi keylerini gir) ── */
const MAPBOX_TOKEN   = 'pk.eyJ1IjoiY2V0aW5idWdyYWEiLCJhIjoiY21uNXRqcnN2MGQ5YzJ0c2NqdW0zaG04ZSJ9.pkCUVwUhkrfNH-zcP1BvDA';
const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_KEY_HERE';

/* ============================================
   1. CUSTOM CURSOR
   ============================================ */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  if (!cursor || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Ring follows with lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .card, .feature-card, .lens-card, .faq-item, .social-link, .pin');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

/* ============================================
   2. NAVIGATION
   ============================================ */
function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

/* ============================================
   3. SCROLL REVEAL
   ============================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}

/* ============================================
   4. SUNCALC — GOLDEN HOUR HESAPLAMA
   ============================================ */

/**
 * Enlem/boylam ve tarih için güneş verilerini hesaplar.
 * SunCalc kütüphanesi gerektirir: https://github.com/mourner/suncalc
 * <script src="https://cdnjs.cloudflare.com/ajax/libs/suncalc/1.9.0/suncalc.min.js"></script>
 */
function getSunData(lat, lng, date = new Date()) {
  if (typeof SunCalc === 'undefined') {
    console.warn('SunCalc kütüphanesi yüklü değil.');
    return null;
  }

  const times = SunCalc.getTimes(date, lat, lng);
  const sunPos = SunCalc.getPosition(date, lat, lng);

  return {
    sunrise:          formatTime(times.sunrise),
    sunset:           formatTime(times.sunset),
    goldenHourMorningStart: formatTime(times.goldenHour),
    goldenHourMorningEnd:   formatTime(times.goldenHourEnd),
    goldenHourEveningStart: formatTime(times.sunsetStart),
    goldenHourEveningEnd:   formatTime(times.sunset),
    solarNoon:        formatTime(times.solarNoon),
    azimuth:          Math.round(sunPos.azimuth * (180 / Math.PI) + 180) + '°',
    altitude:         Math.round(sunPos.altitude * (180 / Math.PI)) + '°',
    rawTimes:         times,
  };
}

function formatTime(date) {
  if (!date || isNaN(date)) return '--:--';
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Verilen koordinatlar için güneş veri kartını günceller.
 */
function updateSunCard(lat, lng, containerId) {
  const data = getSunData(lat, lng);
  const container = document.getElementById(containerId);
  if (!data || !container) return;

  container.innerHTML = `
    <div class="sun-data-grid">
      <div class="sun-item">
        <span class="sun-key">Gün Doğumu</span>
        <span class="sun-val">${data.sunrise}</span>
      </div>
      <div class="sun-item">
        <span class="sun-key">Gün Batımı</span>
        <span class="sun-val">${data.sunset}</span>
      </div>
      <div class="sun-item gold">
        <span class="sun-key">🌅 Sabah Altın Saat</span>
        <span class="sun-val">${data.goldenHourMorningStart} – ${data.goldenHourMorningEnd}</span>
      </div>
      <div class="sun-item gold">
        <span class="sun-key">🌇 Akşam Altın Saat</span>
        <span class="sun-val">${data.goldenHourEveningStart} – ${data.goldenHourEveningEnd}</span>
      </div>
      <div class="sun-item">
        <span class="sun-key">Öğlen</span>
        <span class="sun-val">${data.solarNoon}</span>
      </div>
      <div class="sun-item">
        <span class="sun-key">Güneş Açısı</span>
        <span class="sun-val">${data.altitude}</span>
      </div>
    </div>
  `;
}

/* ============================================
   5. MAPBOX HARİTA
   ============================================ */

let map = null;
let markers = [];
let locations = JSON.parse(localStorage.getItem('dmc_locations') || '[]');

const PIN_COLORS = {
  'Otomobil Çekimi': '#e87b3a',
  'Portre':          '#d4a843',
  'Altın Saat':      '#f0c060',
  '135mm Uygun':     '#a0c4ff',
  'Geniş Açı':       '#80d4a0',
};

/**
 * Mapbox haritayı başlatır.
 * Sayfada <div id="map"></div> olması gerekir.
 */
function initMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  if (MAPBOX_TOKEN === 'pk.eyJ1IjoiY2V0aW5idWdyYWEiLCJhIjoiY21uNXRqcnN2MGQ5YzJ0c2NqdW0zaG04ZSJ9.pkCUVwUhkrfNH-zcP1BvDA') {
    mapContainer.innerHTML = `
      <div style="height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;font-family:'Space Mono',monospace;font-size:11px;color:#555;background:#111;border:1px solid #2a2a2a;">
        <span style="font-size:40px">🗺</span>
        <span>Harita için MAPBOX_TOKEN gerekli</span>
        <span style="font-size:9px;opacity:0.5">main.js içinde MAPBOX_TOKEN değişkenini ayarla</span>
      </div>`;
    return;
  }

  mapboxgl.accessToken = MAPBOX_TOKEN;

  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [32.8597, 39.9334], // Ankara
    zoom: 12,
    cursor: 'none',
  });

  // Controls
  map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');
  map.addControl(new mapboxgl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: false }), 'top-right');

  map.on('load', () => {
    loadSavedLocations();
    map.on('click', handleMapClick);
  });
}

function handleMapClick(e) {
  const { lng, lat } = e.lngLat;
  openAddLocationModal(lat, lng);
}

function openAddLocationModal(lat, lng) {
  const name = prompt('📍 Lokasyon adı:');
  if (!name) return;

  const tagOptions = Object.keys(PIN_COLORS).join(' / ');
  const tag  = prompt(`Etiket (${tagOptions}):`, 'Portre');
  const lens = prompt('Lens önerisi (örn: 135mm F2):', '135mm F2');
  const note = prompt('Not (isteğe bağlı):', '');

  const location = {
    id:   Date.now(),
    name, tag: tag || 'Portre', lens: lens || '135mm F2',
    note: note || '', lat, lng,
    createdAt: new Date().toISOString(),
  };

  locations.push(location);
  saveLocations();
  addMarker(location);
  showSunInfo(lat, lng, name);
}

function addMarker(loc) {
  if (!map) return;

  const color = PIN_COLORS[loc.tag] || '#d4a843';

  // Custom marker element
  const el = document.createElement('div');
  el.style.cssText = `
    width: 14px; height: 14px;
    background: ${color};
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 12px ${color}66;
    transition: transform 0.2s;
  `;
  el.addEventListener('mouseenter', () => el.style.transform = 'scale(1.5)');
  el.addEventListener('mouseleave', () => el.style.transform = 'scale(1)');

  const sunData = getSunData(loc.lat, loc.lng);
  const goldenTime = sunData ? sunData.goldenHourEveningStart : '--:--';

  const popup = new mapboxgl.Popup({ offset: 16, closeButton: true, maxWidth: '280px' })
    .setHTML(`
      <div style="font-family:'Space Mono',monospace;font-size:10px;color:#c8c0b4;padding:4px">
        <div style="font-size:16px;color:#e8e0d4;margin-bottom:10px;font-family:'Cormorant Garamond',serif;font-weight:400">${loc.name}</div>
        <div style="color:#d4a843;margin-bottom:6px;font-size:9px;letter-spacing:0.1em">${loc.tag}</div>
        <div style="margin-bottom:4px">🔭 ${loc.lens}</div>
        <div style="margin-bottom:4px">🌇 Altın Saat: <span style="color:#d4a843">${goldenTime}</span></div>
        ${loc.note ? `<div style="margin-top:8px;color:#555;line-height:1.6">${loc.note}</div>` : ''}
        <div style="margin-top:12px;font-size:8px;color:#444">${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}</div>
        <button onclick="deleteLocation(${loc.id})" style="margin-top:10px;font-family:'Space Mono',monospace;font-size:8px;color:#c04040;background:none;border:1px solid #3a1a1a;padding:4px 10px;cursor:pointer;letter-spacing:0.1em">SİL</button>
      </div>
    `);

  const marker = new mapboxgl.Marker(el)
    .setLngLat([loc.lng, loc.lat])
    .setPopup(popup)
    .addTo(map);

  markers.push({ id: loc.id, marker });
}

function deleteLocation(id) {
  locations = locations.filter(l => l.id !== id);
  saveLocations();
  const found = markers.find(m => m.id === id);
  if (found) { found.marker.remove(); markers = markers.filter(m => m.id !== id); }
}

function loadSavedLocations() {
  locations.forEach(loc => addMarker(loc));
}

function saveLocations() {
  localStorage.setItem('dmc_locations', JSON.stringify(locations));
  renderLocationList();
}

function renderLocationList() {
  const list = document.getElementById('locationList');
  if (!list) return;

  if (!locations.length) {
    list.innerHTML = '<p style="font-family:\'Space Mono\',monospace;font-size:10px;color:#555;padding:24px">Henüz lokasyon eklenmedi. Haritaya tıkla.</p>';
    return;
  }

  list.innerHTML = locations.map(loc => `
    <div class="location-list-item" style="padding:16px 24px;border-bottom:1px solid #2a2a2a;display:flex;justify-content:space-between;align-items:center;cursor:pointer;transition:background 0.2s" onmouseover="this.style.background='#1f1f1f'" onmouseout="this.style.background='transparent'" onclick="flyToLocation(${loc.lat},${loc.lng})">
      <div>
        <div style="font-size:17px;color:#e8e0d4;font-family:'Cormorant Garamond',serif">${loc.name}</div>
        <div style="font-family:'Space Mono',monospace;font-size:9px;color:#d4a843;letter-spacing:0.1em;margin-top:4px">${loc.tag} · ${loc.lens}</div>
      </div>
      <span style="font-size:16px;color:#2a2a2a">→</span>
    </div>
  `).join('');
}

function flyToLocation(lat, lng) {
  if (!map) return;
  map.flyTo({ center: [lng, lat], zoom: 15, speed: 1.4 });
}

/* ============================================
   6. HAVA DURUMU
   ============================================ */
async function getWeather(lat, lng) {
  if (WEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_KEY_HERE') return null;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric&lang=tr`
    );
    const data = await res.json();
    return {
      temp:        Math.round(data.main.temp) + '°C',
      feels:       Math.round(data.main.feels_like) + '°C',
      description: data.weather[0].description,
      clouds:      data.clouds.all + '%',
      wind:        data.wind.speed + ' m/s',
      icon:        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      shootable:   data.clouds.all < 50 ? '✓ Çekim uygun' : '⚠ Bulutlu',
    };
  } catch (err) {
    console.error('Hava durumu alınamadı:', err);
    return null;
  }
}

async function showSunInfo(lat, lng, locationName) {
  const sunData = getSunData(lat, lng);
  const weather = await getWeather(lat, lng);

  const infoPanel = document.getElementById('sunInfoPanel');
  if (!infoPanel || !sunData) return;

  infoPanel.style.display = 'block';
  infoPanel.innerHTML = `
    <div style="font-family:'Space Mono',monospace;font-size:9px;color:#d4a843;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:16px">
      📍 ${locationName}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div>
        <div style="font-size:8px;color:#555;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px">Gün Doğumu</div>
        <div style="font-size:20px;color:#e8e0d4;font-family:'Cormorant Garamond',serif;font-style:italic">${sunData.sunrise}</div>
      </div>
      <div>
        <div style="font-size:8px;color:#555;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px">Gün Batımı</div>
        <div style="font-size:20px;color:#e8e0d4;font-family:'Cormorant Garamond',serif;font-style:italic">${sunData.sunset}</div>
      </div>
      <div>
        <div style="font-size:8px;color:#d4a843;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px">🌅 Sabah Altın Saat</div>
        <div style="font-size:16px;color:#d4a843;font-family:'Cormorant Garamond',serif;font-style:italic">${sunData.goldenHourMorningStart} – ${sunData.goldenHourMorningEnd}</div>
      </div>
      <div>
        <div style="font-size:8px;color:#d4a843;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:4px">🌇 Akşam Altın Saat</div>
        <div style="font-size:16px;color:#d4a843;font-family:'Cormorant Garamond',serif;font-style:italic">${sunData.goldenHourEveningStart} – ${sunData.goldenHourEveningEnd}</div>
      </div>
    </div>
    ${weather ? `
    <div style="border-top:1px solid #2a2a2a;padding-top:16px;font-family:'Space Mono',monospace;font-size:10px;color:#555">
      <span style="color:${weather.clouds < '50' ? '#80d4a0' : '#e87b3a'}">${weather.shootable}</span>
      &nbsp;·&nbsp; ${weather.temp} &nbsp;·&nbsp; Bulut: ${weather.clouds} &nbsp;·&nbsp; Rüzgar: ${weather.wind}
    </div>` : ''}
  `;
}

/* ============================================
   7. KULLANICI KONUMU (GEOLOCATİON)
   ============================================ */
function getUserLocation() {
  if (!navigator.geolocation) {
    alert('Tarayıcınız konum özelliğini desteklemiyor.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      if (map) map.flyTo({ center: [lng, lat], zoom: 14, speed: 1.2 });
      const sunData = getSunData(lat, lng);
      if (sunData) {
        console.log('Konumunuz için altın saat:', sunData.goldenHourEveningStart, '–', sunData.goldenHourEveningEnd);
      }
    },
    err => console.warn('Konum alınamadı:', err.message)
  );
}

/* ============================================
   8. CONTACT FORM VALİDASYON
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const btn = form.querySelector('.btn-submit');
  if (btn) {
    btn.addEventListener('click', handleContactSubmit);
  }
}

function handleContactSubmit() {
  const firstName = document.getElementById('firstName')?.value.trim();
  const email     = document.getElementById('email')?.value.trim();
  const message   = document.getElementById('message')?.value.trim();
  const agree     = document.getElementById('agree')?.checked;

  if (!firstName || !email || !message) {
    showFormAlert('Lütfen ad, e-posta ve mesaj alanlarını doldurun.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showFormAlert('Geçerli bir e-posta adresi girin.', 'error');
    return;
  }

  if (!agree) {
    showFormAlert('Devam etmek için iletişim politikasını kabul etmeniz gerekiyor.', 'error');
    return;
  }

  const successMsg = document.getElementById('successMsg');
  if (successMsg) successMsg.classList.add('show');

  const form = document.getElementById('contactForm');
  if (form) { form.style.opacity = '0.5'; form.style.pointerEvents = 'none'; }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormAlert(message, type = 'error') {
  let alert = document.getElementById('formAlert');
  if (!alert) {
    alert = document.createElement('div');
    alert.id = 'formAlert';
    document.getElementById('contactForm')?.appendChild(alert);
  }
  alert.className = `alert alert-${type}`;
  alert.textContent = (type === 'error' ? '⚠ ' : '✓ ') + message;
  alert.style.display = 'block';
  setTimeout(() => { alert.style.display = 'none'; }, 4000);
}

/* ============================================
   9. YARDIMCI FONKSİYONLAR
   ============================================ */
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

function formatDate(date = new Date()) {
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function compassDirection(degrees) {
  const dirs = ['K','KD','D','GD','G','GB','B','KB'];
  return dirs[Math.round(degrees / 45) % 8];
}

/* ============================================
   10. SAYFA BAZLI INIT
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Tüm sayfalarda çalışır
  initCursor();
  initNav();
  initScrollReveal();

  // Sadece harita olan sayfada
  if (document.getElementById('map')) {
    initMap();
    renderLocationList();
  }

  // Sadece iletişim sayfasında
  if (document.getElementById('contactForm')) {
    initContactForm();
  }

  // Sayfa yüklenince lokasyon al (isteğe bağlı)
  // getUserLocation();

  console.log('%cDış-Mekan-Çekimi', 'color:#d4a843;font-family:serif;font-size:18px;font-style:italic');
  console.log('%cLokasyon bazlı ışık planlama platformu', 'color:#555;font-family:monospace;font-size:10px');
});
