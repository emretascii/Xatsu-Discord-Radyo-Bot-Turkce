# 🎶 Xatsu Discord Radyo Bot 🇹🇷

Discord sunucunuzda **7/24 radyo keyfi** yaşatmak için geliştirilmiş basit ve kullanışlı bir bot.  
Türkiye’nin popüler radyolarını tek komutla dinleyin! 🎧📻  

---

## ✨ Özellikler
- 🎵 Discord ses kanalına bağlanıp radyo çalar  
- ⏯️ Basit komutlarla kontrol (`!radyo`, `!dur`, `!devam`)  
- 🔘 3x3 buton sistemi ile kolay radyo değiştirme  
- 📡 PowerTürk, Kral Pop, SlowTürk ve daha fazlası  

---

## ⚙️ Kurulum
1. 📥 Repoyu indir / klonla:
   ```bash
   git clone https://github.com/emretascii/Xatsu-Discord-Radyo-Bot-Turkce.git
   cd Xatsu-Discord-Radyo-Bot-Turkce
   ```
2. 📦 Gerekli paketleri yükle:
   ```bash
   npm install
   ```
3. 🔑 `.env` dosyası oluştur ve aşağıdaki gibi doldur:
   ```env
   DISCORD_TOKEN=buraya_discord_bot_tokenini_yaz
   GUILD_ID=buraya_sunucu_id
   VOICE_CHANNEL_ID=buraya_ses_kanali_id
   AUTOPLAY=1
   ```
   > ⚠️ `DISCORD_TOKEN` değerini **Discord Developer Portal** üzerinden aldığın token ile değiştir.  
   > `GUILD_ID` ve `VOICE_CHANNEL_ID` → Discord’da sağ tık → **ID Kopyala** ile alabilirsin.  

4. ▶️ Botu çalıştır:
   ```bash
   node bot.js
   ```
   veya daha kolay:
   ```bash
   npm start
   ```

---

## 🛠️ Komutlar
- `!radyo` → Radyo menüsünü açar (9 adet buton çıkar)  
- `!dur` → Radyoyu duraklatır ⏸️  
- `!devam` → Radyoyu devam ettirir ▶️  
- `!bitir` → Botu kanaldan çıkarır ❌  

---

## 📂 Proje Yapısı
```
📁 xatsu-radio
 ┣ 📄 bot.js              → Botun ana dosyası
 ┣ 📄 package.json        → Bağımlılıklar ve scriptler
 ┣ 📄 package-lock.json
 ┣ 📄 .env                → Senin token & ayarların
 ┣ 📄 .gitignore
 ┗ 📄 README.md           → Bu dosya
```

---

## 💡 Notlar
- Botu çalıştırmak için bilgisayarınızın açık olması gerekir ⚡  
- Token’ınızı kimseyle paylaşmayın 🔒  
- Radyo listesine istediğiniz kanalları ekleyebilirsiniz 📝  

---

# ❤️ Katkı
Eğer projeyi geliştirip katkı yapmak istersen:  
1. 🍴 Fork yap  
2. 🌿 Yeni branch aç  
3. ✍️ Düzenlemelerini commit et  
4. 📤 Pull Request gönder  

---

# 🎉 Teşekkürler
Bu projeyi kullandığınız için teşekkürler! 🙌  
Discord sunucunuzda keyifli dinlemeler 🎶  
