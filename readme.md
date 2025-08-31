# 🎵 XATSU Radio Bot

<div align="center">
  
![Discord](https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**🎛️ Türk radyo istasyonlarını Discord sunucunuzda dinleyin!**

**✨ 2x2 Grid • 🔄 Otomatik Yeniden Başlatma • 🎧 Yüksek Kalite**

</div>

---

## 📻 Özellikler

- 🎵 **4 Popüler Türk Radyo İstasyonu** (PowerTürk, Süper FM, Fenomen, JoyTürk)
- 🎛️ **2x2 Buton Grid** ile kolay istasyon değiştirme
- 🔄 **Otomatik Yeniden Başlatma** - stream kesilirse kendini tamir eder
- ⚡ **Hızlı URL Seçimi** - en iyi bağlantıyı otomatik bulur
- 🎧 **Yüksek Ses Kalitesi** - optimizasyonlu ses aktarımı
- 🤖 **Oto-Play** - sunucu açılışında otomatik başlatma
- 🧹 **Temiz Konsol** - gereksiz loglar filtrelenmiş

---

## 🚀 Kurulum

### 📋 Gereksinimler

- **Node.js** v16.9.0 veya üzeri
- **FFmpeg** (ses işleme için)
- **Discord Bot Token**
- **Python** (bazı npm paketleri için)

### 1️⃣ Node.js Kurulumu

**Windows:**
```bash
# Chocolatey ile
choco install nodejs

# Veya resmi siteden indirin:
```
📥 [Node.js İndir](https://nodejs.org/en/download/)

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

### 2️⃣ FFmpeg Kurulumu

**Windows:**
```bash
# Chocolatey ile
choco install ffmpeg

# Veya manuel kurulum:
```
📥 [FFmpeg Windows İndir](https://www.gyan.dev/ffmpeg/builds/)

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

### 3️⃣ Proje Kurulumu

```bash
# 1. Projeyi klonlayın
git clone https://github.com/your-username/xatsu-radio-bot.git
cd xatsu-radio-bot

# 2. Bağımlılıkları yükleyin
npm install
npm i -S @discordjs/voice @discordjs/opus opusscript ffmpeg-static libsodium-wrappers tweetnacl dotenv


# 3. Environment dosyası oluşturun
cp .env.example .env
```

### 4️⃣ Discord Bot Oluşturma

1. 🔗 [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. ➕ **"New Application"** butonuna tıklayın
3. 🤖 **"Bot"** sekmesine gidin
4. 🔑 **"Token"** kopyalayın
5. ⚙️ **Bot Permissions** ayarlayın:
   - ✅ Send Messages
   - ✅ Use Slash Commands  
   - ✅ Connect (Voice)
   - ✅ Speak (Voice)
   - ✅ Use Voice Activity

### 5️⃣ .env Dosyası Ayarı

`.env` dosyasını düzenleyin:

```env
# Discord Bot Token (Zorunlu)
DISCORD_TOKEN=your_bot_token_here

# Otomatik Başlatma (İsteğe Bağlı)
AUTOPLAY=1
GUILD_ID=your_server_id
VOICE_CHANNEL_ID=your_voice_channel_id
```

#### 🔍 ID'leri Nasıl Bulabilirim?

1. **Discord'da Developer Mode'u açın:**
   - ⚙️ User Settings → Advanced → Developer Mode ✅

2. **Server ID:**
   - Sunucuya sağ tıklayın → **"Copy ID"**

3. **Voice Channel ID:**
   - Ses kanalına sağ tıklayın → **"Copy ID"**

---

## ▶️ Başlatma

```bash
# Botu başlatın
npm run dev

# Veya PM2 ile (production için önerilen)
npm install -g pm2
pm2 start index.js --name "xatsu-radio"
```

### 📺 Beklenen Konsol Çıktısı:

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

---

## 🎮 Kullanım

### 💬 Komutlar

| Komut | Açıklama |
|-------|----------|
| `!radyo` | 🎛️ 2x2 istasyon seçici grid |
| `!play` | ▶️ Radyoyu başlat |
| `!pause` | ⏸️ Radyoyu duraklat |
| `!stop` | ⏹️ Radyoyu durdur |
| `!status` | 📊 Bot durumunu göster |
| `!ping` | 🏓 Gecikmeleri ölç |
| `!help` | ❓ Yardım menüsü |

### 🎛️ İstasyon Grid'i

```
[PowerTürk] [Süper FM]
[Fenomen]   [JoyTürk] 
```

- 🟢 **Yeşil buton** = Şu anda çalan istasyon
- ⚪ **Gri buton** = Diğer istasyonlar
- 📻 Butona tıklayarak istasyon değiştirin!

---

## 📦 Package.json

Gerekli bağımlılıklar:

```json
{
  "name": "xatsu-radio-bot",
  "version": "2.0.0",
  "description": "Turkish radio stations Discord bot",
  "main": "index.js",
  "dependencies": {
    "discord.js": "^14.14.1",
    "@discordjs/voice": "^0.16.1",
    "@discordjs/opus": "^0.9.0",
    "undici": "^6.6.2",
    "dotenv": "^16.4.1",
    "ffmpeg-static": "^5.2.0"
  },
  "scripts": {
    "start": "node index.js"
  }
}
```

---

## 🛠️ Sorun Giderme

### ❌ FFmpeg Bulunamadı Hatası

```bash
# Windows
choco install ffmpeg

# macOS  
brew install ffmpeg

# Linux
sudo apt install ffmpeg
```

### ❌ Node Modules Hatası

```bash
# Node modules'ı temizle ve yeniden yükle
rm -rf node_modules package-lock.json
npm install
```

### ❌ Python Hatası (Windows)

```bash
# Visual Studio Build Tools yükle
npm install --global windows-build-tools

# Veya Python'u manuel yükle
```
📥 [Python İndir](https://www.python.org/downloads/)

### ❌ Discord Bağlantı Hatası

- ✅ Bot token'ının doğru olduğundan emin olun
- ✅ Bot'un sunucuya eklendiğinden emin olun
- ✅ İnternet bağlantınızı kontrol edin

### ❌ Ses Çalmıyor

- ✅ Bot'un ses kanalına bağlanma yetkisi var mı?
- ✅ FFmpeg kurulu mu? (`ffmpeg -version` ile test edin)
- ✅ Ses kanalında başka bot var mı?

---

## 📊 Sistem Gereksinimleri

| Bileşen | Minimum | Önerilen |
|---------|---------|----------|
| **RAM** | 512 MB | 1 GB |
| **CPU** | 1 Core | 2 Core |
| **Disk** | 100 MB | 500 MB |
| **Network** | 1 Mbps | 5 Mbps |

---

## 🔄 Güncelleme

```bash
# Yeni sürümü çek
git pull origin main

# Bağımlılıkları güncelle
npm install

# Botu yeniden başlat
pm2 restart xatsu-radio
```

---

## 📝 Changelog

### v2.0.0 (Latest)
- ✨ 2x2 Grid sistemi
- 🔄 Otomatik yeniden başlatma
- 🧹 Temiz konsol çıktısı
- ⚡ Performance iyileştirmeleri

### v1.0.0
- 🎵 Temel radyo bot özellikleri
- 📻 4 istasyon desteği

---

## 🤝 Katkıda Bulunma

1. 🍴 Fork yapın
2. 🌟 Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. 💾 Commit yapın (`git commit -m 'Add amazing feature'`)
4. 📤 Push yapın (`git push origin feature/amazing-feature`)
5. 🔀 Pull Request açın

---

## 📜 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyin.

---

## 🌟 Destek

Bu projeyi beğendiyseniz ⭐ vermeyi unutmayın!

**🐛 Bug Report:** [Issues](https://github.com/your-username/xatsu-radio-bot/issues) sayfasından bildirebilirsiniz.

**💡 Feature Request:** Yeni özellik önerilerinizi Issues sayfasından paylaşabilirsiniz.

---

<div align="center">

### 💝 Made with ❤️ in Istanbul

**🧑‍💻 Developer:** [Emre Taşçı](https://github.com/your-username)

---

**🎵 XATSU Radio Bot** • **📅 2025** • **🇹🇷 Turkey**

</div>