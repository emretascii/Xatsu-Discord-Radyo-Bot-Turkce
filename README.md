# 🎵 Xatsu Discord Radio Bot

<div align="center">

![Xatsu Radio Bot](https://img.shields.io/badge/Xatsu-Radio%20Bot-red?style=for-the-badge&logo=discord&logoColor=white)
![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-16.9.0+-green?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge)

**🎛️ Türk radyo istasyonlarını Discord sunucunuzda dinleyin!**

*✨ 2x2 Grid • 🔄 Otomatik Yeniden Başlatma • 🎧 Yüksek Kalite*

[🚀 Hızlı Başlangıç](#-kurulum) • [📝 Komutlar](#-komutlar) • [⚙️ Yapılandırma](#%EF%B8%8F-yapılandırma) • [🐛 Sorun Giderme](#-sorun-giderme)

</div>

---

## ✨ Özellikler

- 🎵 **4 Popüler Türk Radyo İstasyonu** - PowerTürk, Süper FM, Fenomen, JoyTürk
- 🎛️ **2x2 Buton Grid** ile kolay istasyon değiştirme
- 🔄 **Otomatik Yeniden Başlatma** - stream kesilirse kendini tamir eder
- ⚡ **Hızlı URL Seçimi** - en iyi bağlantıyı otomatik bulur
- 🎧 **Yüksek Ses Kalitesi** - optimizasyonlu ses aktarımı
- 🤖 **Oto-Play** - sunucu açılışında otomatik başlatma
- 🧹 **Temiz Konsol** - gereksiz loglar filtrelenmiş

## 📋 Gereksinimler

- Node.js v16.9.0 veya üzeri
- FFmpeg (ses işleme için)
- Discord Bot Token
- Python (bazı npm paketleri için)

### Node.js Kurulumu

**Windows:**
```bash
# Chocolatey ile
choco install nodejs
# Veya resmi siteden indirin: https://nodejs.org
```

**macOS:**
```bash
# Homebrew ile
brew install node
# Veya resmi siteden indirin
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### FFmpeg Kurulumu

**Windows:**
```bash
# Chocolatey ile
choco install ffmpeg
# Veya manuel kurulum: https://ffmpeg.org/download.html
```

**macOS:**
```bash
# Homebrew ile
brew install ffmpeg
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

## 🚀 Kurulum

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/emretascii/Xatsu-Discord-Radyo-Bot-Turkce.git
cd Xatsu-Discord-Radyo-Bot-Turkce
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
npm i -S @discordjs/voice @discordjs/opus opusscript ffmpeg-static libsodium-wrappers tweetnacl dotenv
```

### 3. Environment Dosyası Oluşturun
```bash
cp .env.example .env
```

## 🤖 Discord Bot Kurulumu

### Bot Token Alma

1. 🔗 [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. ➕ "New Application" butonuna tıklayın
3. 🤖 "Bot" sekmesine gidin
4. 🔑 "Token" kopyalayın

### Bot Permissions

⚙️ Bot Permissions ayarlayın:
- ✅ Send Messages
- ✅ Use Slash Commands
- ✅ Connect (Voice)
- ✅ Speak (Voice)
- ✅ Use Voice Activity

## ⚙️ Yapılandırma

`.env` dosyasını düzenleyin:

```env
# Discord Bot Token (Zorunlu)
DISCORD_TOKEN=your_bot_token_here

# Otomatik Başlatma (İsteğe Bağlı)
AUTOPLAY=1
GUILD_ID=your_server_id
VOICE_CHANNEL_ID=your_voice_channel_id
```

### ID'leri Alma

**Discord'da Developer Mode'u açın:**
- ⚙️ User Settings → Advanced → Developer Mode ✅

**Server ID:**
- Sunucuya sağ tıklayın → "Copy ID"

**Voice Channel ID:**
- Ses kanalına sağ tıklayın → "Copy ID"

## ▶️ Çalıştırma

```bash
# Botu başlatın
npm run dev

# Veya PM2 ile (production için önerilen)
npm install -g pm2
pm2 start index.js --name "xatsu-radio"
```

### Başarılı Başlatma Çıktısı
```
================= XATSU RADIO BOT =================
🎵 Bot başlatılıyor...
📅 31.08.2025 17:17:53
====================================================
🔐 Discord'a bağlanılıyor... (1/3)
✅ Bot aktif: Xatsu Radio Bot#1234
📊 Sunucu sayısı: 1
====================================================
🔄 Otomatik radyo başlatılıyor...
🎵 PowerTürk çalıyor
✅ Otomatik radyo başlatıldı
```

## 📝 Komutlar

| Komut | Açıklama |
|-------|----------|
| `!radyo` | 🎛️ 2x2 istasyon seçici grid |
| `!play` | ▶️ Radyoyu başlat |
| `!pause` | ⏸️ Radyoyu duraklat |
| `!stop` | ⏹️ Radyoyu durdur |
| `!status` | 📊 Bot durumunu göster |
| `!ping` | 🏓 Gecikmeleri ölç |
| `!help` | ❓ Yardım menüsü |

## 🎛️ İstasyon Grid Sistemi

```
[PowerTürk] [Süper FM]
[Fenomen] [JoyTürk]
```

- 🟢 **Yeşil buton** = Şu anda çalan istasyon
- ⚪ **Gri buton** = Diğer istasyonlar
- 📻 **Butona tıklayarak istasyon değiştirin!**

## 🔧 Sistem Gereksinimleri

| Bileşen | Minimum | Önerilen |
|---------|---------|----------|
| RAM | 512 MB | 1 GB |
| CPU | 1 Core | 2 Core |
| Disk | 100 MB | 500 MB |
| Network | 1 Mbps | 5 Mbps |

## 🐛 Sorun Giderme

### Yaygın Sorunlar

**Bot bağlanamıyor:**
- ✅ Bot token'ının doğru olduğundan emin olun
- ✅ Bot'un sunucuya eklendiğinden emin olun
- ✅ İnternet bağlantınızı kontrol edin

**Ses problemi:**
- ✅ Bot'un ses kanalına bağlanma yetkisi var mı?
- ✅ FFmpeg kurulu mu? (`ffmpeg -version` ile test edin)
- ✅ Ses kanalında başka bot var mı?

### Node.js Build Hataları

```bash
# Windows
choco install ffmpeg

# macOS
brew install ffmpeg

# Linux
sudo apt install ffmpeg

# Node modules'ı temizle ve yeniden yükle
rm -rf node_modules package-lock.json
npm install

# Visual Studio Build Tools yükle
npm install --global windows-build-tools
```

## 🔄 Güncelleme

```bash
# Yeni sürümü çek
git pull origin main

# Bağımlılıkları güncelle
npm install

# Botu yeniden başlat
pm2 restart xatsu-radio
```

## 📋 Değişiklik Geçmişi

### v2.0.0 (Mevcut)
- ✨ 2x2 Grid sistemi
- 🔄 Otomatik yeniden başlatma
- 🧹 Temiz konsol çıktısı
- ⚡ Performance iyileştirmeleri

### v1.0.0
- 🎵 Temel radyo bot özellikleri
- 📻 4 istasyon desteği

## 🤝 Katkıda Bulunma

1. 🍴 Fork yapın
2. 🌟 Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. 💾 Commit yapın (`git commit -m 'Add amazing feature'`)
4. 📤 Push yapın (`git push origin feature/amazing-feature`)
5. 🔀 Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyin.

## 🙏 Teşekkürler

Bu projeyi beğendiyseniz ⭐ vermeyi unutmayın!

## 📞 İletişim

- 🐛 **Bug Report:** [Issues](https://github.com/emretascii/Xatsu-Discord-Radyo-Bot-Turkce/issues) sayfasından bildirebilirsiniz
- 💡 **Feature Request:** Yeni özellik önerilerinizi Issues sayfasından paylaşabilirsiniz
- 🧑‍💻 **Developer:** [Emre Taşçı](https://github.com/emretascii)

---

<div align="center">

**🎵 XATSU Radio Bot • 📅 2025 • 🇹🇷 Turkey**

*Made with ❤️ by [Emre Taşçı](https://github.com/emretascii)*

</div>