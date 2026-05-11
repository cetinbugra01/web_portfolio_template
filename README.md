# 📷 Dış-Mekan-Çekimi
2026

> Dış mekan portre ve otomobil çekimleri içi **lokasyon bazlı ışık planlama platformu.**

![Version](https://img.shields.io/badge/versiyon-1.0.0-D4A843)
![Status](https://img.shields.io/badge/durum-geliştiriliyor-E87B3A)
![License](https://img.shields.io/badge/lisans-MIT-27AE60)

---

## 🌟 Proje Hakkında

135mm F2 gibi dar açılı lenslerle yapılan dış mekan çekimlerinde doğru ışığı ve arka planı bulmak zordur. **Altın Saat** yalnızca ~47 dakika sürer ve bu pencereyi verimli kullanmak için önceden planlama şarttır.

Bu platform; harita üzerinde lokasyon işaretleme, konuma özel altın saat hesaplama ve çekim notları tutma özelliklerini tek çatı altında toplar.

---

## 🗂 Proje Yapısı

```
dis-mekan-cekimi/
│
├── index.html              ← Ana sayfa
├── about.html              ← Proje hakkında
├── contact.html            ← İletişim formu
├── project.html            ← Teknik detaylar
│
├── assets/
│   ├── css/style.css       ← Global stiller
│   ├── js/main.js          ← Harita, SunCalc, form
│   └── img/                ← SVG görseller
│
├── docs/
│   ├── gantt.xlsx          ← Gantt şeması (Excel)
│   └── gantt.docx          ← Gantt şeması (Word)
│
└── README.md
```

---

## ✨ Özellikler

| # | Özellik | Açıklama | API |
|---|---------|----------|-----|
| 1 | **Harita & Etiketleme** | Çekim noktalarını pinle, kategori ekle | Mapbox GL JS |
| 2 | **Işık Hesaplama** | Altın saat, gün doğumu/batımı | SunCalc |
| 3 | **Hava Durumu** | Bulutluluk, rüzgar, çekim uygunluğu | OpenWeatherMap |
| 4 | **Keşif Notları** | Lens önerisi, not, fotoğraf arşivi | SQL DB |

---

## 🛠 Teknolojiler

**Frontend:** HTML5 / CSS3 / JavaScript / Mapbox GL JS / SunCalc

**Backend:** PHP veya C# (.NET) / REST API

**Veritabanı:** SQL — Tablolar: `users`, `locations`, `notes`

---

## 📄 Sayfalar

| Sayfa | Dosya | İçerik |
|-------|-------|--------|
| Ana Sayfa | `index.html` | Hero, özellikler, harita, güneş yayı |
| Hakkında | `about.html` | Motivasyon, lens rehberi, ekip |
| Proje | `project.html` | Mimari, DB şeması, API detayları |
| İletişim | `contact.html` | Form, SSS, sosyal linkler |

---

## 📊 Proje Takvimi

| Sprint | Hafta | Konu | Durum |
|--------|-------|------|-------|
| Sprint 1 | H1–3 | Planlama & Tasarım | ✅ Tamamlandı |
| Sprint 2 | H3–6 | Frontend Geliştirme | ✅ Tamamlandı |
| Sprint 3 | H6–9 | Backend & API | 🔄 Devam Ediyor |
| Sprint 4 | H9–12 | Veritabanı & Test | ⏳ Planlı |
| Sprint 5 | H11–13 | Yayın & Sunum | ⏳ Planlı |

---

## 👥 Ekip

> Web Projesi Yönetimi Dersi — 2025

---

## 📜 Lisans

Bu proje MIT Lisansı altında eğitim amaçlı geliştirilmiştir.
