# web_portfolio_template
web projesi yönetimi dersi
[README.md](https://github.com/user-attachments/files/25833993/README.md)
# 📷 Dış-Mekan-Çekimi
> Dış mekan portre ve otomobil çekimleri için lokasyon bazlı ışık planlama platformu.

---

## 🗂 Proje Yapısı

```
dis-mekan-cekimi/
├── index.html       → Ana sayfa
├── about.html       → Hakkında sayfası
├── project.html     → Proje detay sayfası
├── contact.html     → İletişim sayfası
├── style.css        → Global stiller
├── main.js          → JavaScript işlevleri
└── img/             → Görsel dosyaları
```

---

## 🌟 Özellikler

### 1. Harita & Etiketleme
- Çekim noktalarını harita üzerinde pinleme
- Özel etiket kategorileri: `Otomobil Çekimi`, `Portre`, `135mm Uygun`, `Altın Saat Noktası`, `Geniş Açı`
- Kayıtlı lokasyonları listeleme ve düzenleme

### 2. Işık Hesaplama
- Konuma özel gün doğumu / gün batımı saatleri
- Sabah ve akşam Altın Saat (Golden Hour) başlangıç & bitiş zamanları
- Güneş yayı ve yön bilgisi (SunCalc API)
- Anlık hava durumu entegrasyonu

### 3. Keşif Notları
- Mekana özel lens tavsiyeleri (135mm F2, 85mm, 50mm vb.)
- Kompozisyon notları ve çekim ipuçları
- Referans fotoğraf yükleme
- Geçmiş çekim arşivi

---

## 📄 Sayfalar

### `index.html` — Ana Sayfa
- Hero bölümü: proje tanıtımı ve diyafram animasyonu
- Özellikler (3 kart): Harita, Işık Hesaplama, Keşif Notları
- Nasıl Çalışır: 4 adımlı kullanım akışı
- Güneş yayı önizleme görseli (Ankara örneği)
- Harita bölümü ve pin efsanesi
- Teknoloji stack listesi

### `about.html` — Hakkında
- Projenin amacı ve motivasyonu
- 135mm F2 gibi dar açılı lenslerle çekim zorluklarına çözüm
- Geliştirici bilgileri
- Ders bilgisi: Web Projesi Yönetimi

### `project.html` — Proje Detayı
- Teknik mimari ve sistem tasarımı
- Veritabanı şeması
- API entegrasyon detayları
- Ekran görüntüleri / wireframe'ler
- Geliştirme süreci ve kilometre taşları

### `contact.html` — İletişim
- İletişim formu (isim, e-posta, mesaj)
- Proje ekibi bilgileri
- GitHub / sosyal medya bağlantıları

---

## 🛠 Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | PHP veya C# (.NET) |
| Veritabanı | SQL (MySQL / MSSQL) |
| Harita | Google Maps API / Mapbox GL JS |
| Güneş Verisi | SunCalc API |
| Hava Durumu | OpenWeatherMap API |

---

## 🚀 Kurulum

1. Repoyu klonla:
   ```bash
   git clone https://github.com/kullanici/dis-mekan-cekimi.git
   ```

2. API anahtarlarını ayarla (`main.js` içinde):
   ```js
   const MAPBOX_TOKEN = 'senin_token_buraya';
   const WEATHER_API_KEY = 'senin_key_buraya';
   ```

3. Backend için `config.php` veya `appsettings.json` dosyasını düzenle.

4. Veritabanı şemasını çalıştır:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

5. `index.html` dosyasını tarayıcıda aç veya local sunucuda çalıştır.

---

## 👥 Geliştirici

> Web Projesi Yönetimi Dersi — 2025

---

## 📜 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.
