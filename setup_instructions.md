# Discord PowerTürk Radyo Botu

Bu bot, Discord sunucunuzda PowerTürk radyosunu çalmanızı sağlar.

## 🔧 Gereksinimler

- Node.js 18.0.0 veya üzeri
- FFmpeg (sistem genelinde yüklü olmalı)
- Discord Bot Token

## 📦 Kurulum

### 1. Projeyi İndirin
```bash
# Bu dosyaları bir klasöre kaydedin
mkdir discord-radio-bot
cd discord-radio-bot
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Discord Bot Oluşturun

1. [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. "New Application" butonuna tıklayın
3. Botunuza bir isim verin
4. Sol menüden "Bot" sekmesine gidin
5. "Add Bot" butonuna tıklayın
6. "Token" bölümünden bot token'ınızı kopyalayın

### 4. Bot İzinlerini Ayarlayın

Bot'unuzun şu izinlere sahip olması gerekir:
- ✅ Send Messages
- ✅ Connect
- ✅ Speak
- ✅ Use Voice Activity

OAuth2 URL Generator'da bu izinleri seçin ve oluşturulan link ile botu sunucunuza ekleyin.

### 5. Çevre Değişkenlerini Ayarlayın

`.env.example` dosyasını `.env` olarak kopyalayın:
```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin ve bot token'ınızı ekleyin:
```
DISCORD_TOKEN=your_actual_bot_token_here
```

### 6. FFmpeg Kurulumu

#### Windows:
1. [FFmpeg](https://ffmpeg.org/download.html) sitesinden indirin
2. Arşivi çıkarın ve `bin` klasörünü PATH'e ekleyin
3. Veya Chocolatey ile: `choco install ffmpeg`

#### macOS:
```bash
brew install ffmpeg
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install ffmpeg
```

### 7. Botu Başlatın

```bash
npm start
```

Geliştirme için (otomatik yeniden başlatma):
```bash
npm run dev
```

## 🎵 Komutlar

| Komut | Açıklama |
|-------|----------|
| `!play` | PowerTürk radyosunu çalmaya başlar |
| `!pause` | Radyoyu duraklatır |
| `!stop` | Radyoyu durdurur ve ses kanalından çıkar |
| `!help` | Komutları gösterir |

## 📋 Kullanım

1. Discord sunucunuzda bir ses kanalına katılın
2. `!play` komutunu yazın
3. Bot otomatik olarak kanalınıza katılacak ve PowerTürk radyosunu çalmaya başlayacak
4. `!pause` ile duraklatabilir, `!stop` ile tamamen durdurabilirsiniz

## 🔧 Sorun Giderme

### Bot ses kanalına katılamıyor
- Bot'un "Connect" ve "Speak" izinlerine sahip olduğundan emin olun
- Ses kanalının kullanıcı limitine takılmadığından emin olun

### "FFmpeg not found" hatası
- FFmpeg'in düzgün kurulduğundan ve PATH'de olduğundan emin olun
- Terminal/CMD'yi yeniden başlatın

### Radyo çalmıyor
- İnternet bağlantınızı kontrol edin
- PowerTürk radyo stream'inin erişilebilir olduğundan emin olun

### Bot token hatası
- `.env` dosyasında token'ın doğru girildiğinden emin olun
- Token'da gereksiz boşluklar olmadığından emin olun
- Bot token'ınızı yenileyebilirsiniz

## 📁 Proje Yapısı

```
discord-radio-bot/
├── bot.js          # Ana bot dosyası
├── package.json    # Proje bağımlılıkları
├── .env           # Çevre değişkenleri (oluşturulacak)
├── .env.example   # Çevre değişkenleri örneği
└── README.md      # Bu dosya
```

## 🚀 Gelişmiş Özellikler

İsterseniz bu özellikleri ekleyebilirsiniz:
- Ses seviyesi kontrolü
- Çalma listesi desteği
- Kullanıcı izinleri
- Daha fazla radyo kanalı
- Web dashboard

## 📞 Destek

Sorun yaşarsanız:
1. Node.js ve npm versiyonlarınızı kontrol edin
2. Tüm bağımlılıkların yüklendiğinden emin olun
3. Bot izinlerini tekrar kontrol edin
4. Console loglarını kontrol edin

## 📜 Lisans

MIT License - Bu projeyi özgürce kullanabilir ve değiştirebilirsiniz.