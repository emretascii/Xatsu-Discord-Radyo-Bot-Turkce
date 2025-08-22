// ===================== XATSU RADIO BOT (güncellenmiş sürüm – hızlı/otokayıt + 2x2 buton) =====================
// Uyarıları sustur
const originalEmit = process.emit;
process.emit = function (name, data) {
  if (name === 'warning' && data?.name === 'TimeoutNegativeWarning') return false;
  return originalEmit.apply(process, arguments);
};

// --------------------- HTTP(Client) / Undici Ayarı ----------------------
const { setGlobalDispatcher, Agent, request } = require('undici');

console.log('🔧 HTTP Client ayarları optimize ediliyor...');
const customAgent = new Agent({
  connect: {
    timeout: 60000,
    keepAlive: true,
    keepAliveInitialDelay: 10000,
    keepAliveMaxTimeout: 60000
  },
  bodyTimeout: 0,
  headersTimeout: 60000,
  maxRedirections: 5,
  retry: { delay: 2000, retries: 3 }
});
setGlobalDispatcher(customAgent);
console.log('✅ HTTP Client optimize edildi');

// --------------------------- Discord.js ---------------------------------
require('dotenv').config();
const {
  Client, GatewayIntentBits,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, Partials
} = require('discord.js');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  StreamType,
  entersState
} = require('@discordjs/voice');

console.log('🚀 Bot başlatılıyor...');
console.log('📅 Tarih:', new Date().toISOString());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel],
  rest: {
    timeout: 120000,
    retries: 5,
    globalRequestsPerSecond: 50,
    authPrefix: 'Bot',
    api: 'https://discord.com/api',
    cdn: 'https://cdn.discordapp.com',
    invite: 'https://discord.gg'
  },
  ws: {
    version: 10,
    encoding: 'json',
    compress: false,
    large_threshold: 50,
    properties: { $os: process.platform, $browser: 'discord.js', $device: 'discord.js' }
  }
});

// ------------------------------ İstasyonlar (2x2) ---------------------------------
// Her istasyon birden fazla URL içerebilir (en hızlısını seçeceğiz).
const STATIONS = [
  { name: 'PowerTürk', urls: [
    'https://live.powerapp.com.tr/powerturk/mpeg/icecast.audio?/;stream.mp3'
  ]},
  { name: 'Süper FM', urls: [
    'https://playerservices.streamtheworld.com/api/livestream-redirect/SUPER_FM128AAC.aac?'
  ]},
  { name: 'Fenomen', urls: [
    'https://live.radyofenomen.com/fenomen/128/icecast.audio?'
  ]},
  { name: 'JoyTürk', urls: [
    'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_TURK128AAC.aac?'
  ]}
];

// ------------------------------ Durum ---------------------------------
let currentStation = 0;    // aktif istasyon indeksi
let currentUrlIndex = 0;   // aktif istasyon içindeki URL indeksi (bilgi amaçlı)
let connection = null;
let player = null;
let isPlaying = false;
let isCleaning = false; // ÇİFT temizliği engelle

// ------------------------------ Ready -----------------------------------
client.once('ready', async () => {
  console.log(`✅ Bot hazır! ${client.user.tag} olarak giriş yapıldı.`);
  console.log('🎵 Radyo Botu aktif!');
  console.log(`📊 Sunucu sayısı: ${client.guilds.cache.size}`);
  client.user.setActivity('Radyo 🎵', { type: 'LISTENING' });

  // ======= OTO-PLAY =======
  try {
    if (process.env.AUTOPLAY === '1' && process.env.GUILD_ID && process.env.VOICE_CHANNEL_ID) {
      console.log('▶️ Oto-Play: Ses kanalına bağlanıp çalınacak...');
      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      const voiceChannel = await guild.channels.fetch(process.env.VOICE_CHANNEL_ID);
      if (voiceChannel && voiceChannel.isVoiceBased()) {
        await playInChannel(voiceChannel, (txt) => console.log(`[AUTO] ${txt}`));
      } else {
        console.warn('⚠️ Oto-Play: VOICE_CHANNEL_ID bir ses kanalı değil.');
      }
    }
  } catch (e) {
    console.warn('⚠️ Oto-Play başlatılamadı:', e?.message || e);
  }
});

// ---------------------------- Olaylar (log) -----------------------------
client.on('shardError', (e) => console.error('WebSocket hatası:', e));
client.on('shardReconnecting', () => console.log('🔄 Discord\'a yeniden bağlanılıyor...'));
client.on('shardResume', () => console.log('✅ Discord bağlantısı yeniden kuruldu!'));
client.on('error', (e) => console.error('Discord client hatası:', e));
client.on('warn', (w) => console.warn('Discord uyarısı:', w));

// ---------------------------- Komutlar ----------------------------------
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const command = message.content.trim().toLowerCase();
  console.log(`📝 Komut alındı: ${command} - Kullanıcı: ${message.author.username}`);

  try {
    switch (command) {
      case '!play': await handlePlay(message); break;
      case '!pause': await handlePause(message); break;
      case '!stop':  await handleStop(message); break;
      case '!ping':  await handlePing(message); break;
      case '!help':  await handleHelp(message); break;
      case '!test':  message.reply('✅ Bot çalışıyor! Radyo hazır.'); break;
      case '!status':
        message.reply(
          `📊 **Bot Durumu**\n` +
          `🎵 Radyo: ${isPlaying ? 'Çalıyor' : 'Durmuş'}\n` +
          `📻 İstasyon: ${STATIONS[currentStation].name}\n` +
          `🔊 Ses Kanalı: ${connection ? 'Bağlı' : 'Bağlı Değil'}\n` +
          `⏰ Çalışma Süresi: ${Math.floor(process.uptime()/60)} dk`
        );
        break;
      case '!radio': // Mevcut basit bilgi mesajı
        message.reply(
          `📻 **Mevcut Radyo**\n` +
          `🎵 İstasyon: ${STATIONS[currentStation].name}\n` +
          `🔄 İstasyon seçmek için: \`!radyo\``
        );
        break;
      case '!switchurl': // aktif istasyon içinde URL değiştir (manuel)
        currentUrlIndex = (currentUrlIndex + 1) % STATIONS[currentStation].urls.length;
        message.reply(`🔄 URL index değiştirildi (${currentUrlIndex+1}/${STATIONS[currentStation].urls.length}). Yeni stream için \`!play\` yaz.`);
        if (isPlaying) safeCleanup();
        break;
      case '!radyo': // 2x2 grid gönder
        await message.reply({
          content: `🎛️ **Radyo İstasyonu Seç** (şu anda: **${STATIONS[currentStation].name}**)\n📻 Butonlara tıklayarak istasyon değiştirebilirsin!`,
          components: stationButtons()
        });
        break;
    }
  } catch (err) {
    console.error('Komut hatası:', err);
    message.reply('❌ Bir hata oluştu. Tekrar dene.');
  }
});

// --------------------------- Yardımcı: En hızlı URL seç -----------------
// Abort ile ilgili UND_ERR_ABORTED hatalarını güvenle yutacak şekilde yazıldı.
async function pickFastestRadioUrl(candidates, fallbackIndex = 0, perReqTimeout = 1200, overallTimeout = 1800) {
  const controllers = [];
  let overallTimer;

  const makeHeadProbe = (url, idx) => new Promise(async (resolve, reject) => {
    const ac = new AbortController();
    controllers.push(ac);
    const t = setTimeout(() => ac.abort(), perReqTimeout);
    try {
      const res = await request(url, {
        method: 'HEAD',
        headers: { 'Icy-MetaData': '0', 'User-Agent': 'DiscordBot' },
        signal: ac.signal
      });
      const ok = res.statusCode >= 200 && res.statusCode < 300;
      const ct = (res.headers['content-type'] || '').toString().toLowerCase();
      if (ok && (ct.includes('audio') || ct.includes('mpeg') || ct.includes('mp3') || ct === '')) {
        return resolve(idx);
      }
      // HEAD başarısızsa GET Range'e geç
      reject(new Error('head not good'));
    } catch (e) {
      reject(e);
    } finally {
      clearTimeout(t);
    }
  });

  const makeGetProbe = (url, idx) => new Promise(async (resolve, reject) => {
    const ac = new AbortController();
    controllers.push(ac);
    const t = setTimeout(() => ac.abort(), perReqTimeout);
    try {
      const res = await request(url, {
        method: 'GET',
        headers: {
          'Icy-MetaData': '0',
          'Range': 'bytes=0-0',
          'User-Agent': 'DiscordBot'
        },
        signal: ac.signal
      });
      const ok = res.statusCode >= 200 && res.statusCode < 300;
      if (ok) {
        // Body'i güvenli kapat (destroy yerine cancel; abort hatasını yut)
        try {
          if (typeof res.body?.cancel === 'function') await res.body.cancel();
          else res.body?.resume?.();
        } catch { /* yut */ }
        return resolve(idx);
      }
      reject(new Error('get not good'));
    } catch (e) {
      reject(e);
    } finally {
      clearTimeout(t);
    }
  });

  try {
    const probes = candidates.map((u, idx) =>
      makeHeadProbe(u, idx).catch(() => makeGetProbe(u, idx))
    );

    const timedProbes = Promise.any(probes);

    // Genel timeout
    const timeoutP = new Promise((_, rej) => {
      overallTimer = setTimeout(() => rej(new Error('overall timeout')), overallTimeout);
    });

    const winnerIdx = await Promise.race([timedProbes, timeoutP]);

    // Kazanan bulundu; diğerlerini abort et (hata yut)
    controllers.forEach(c => { try { c.abort(); } catch {} });

    return winnerIdx;
  } catch {
    // Hepsi patladı/timeout → fallback
    controllers.forEach(c => { try { c.abort(); } catch {} });
    return fallbackIndex;
  } finally {
    clearTimeout(overallTimer);
  }
}

// --------------------------- 2x2 Buton Oluşturucu -----------------------
function stationButtons() {
  const rows = [];
  
  // 2x2 grid için (4 istasyon)
  for (let r = 0; r < 2; r++) {
    const row = new ActionRowBuilder();
    for (let c = 0; c < 2; c++) {
      const i = r * 2 + c;
      if (i < STATIONS.length) {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`radio:${i}`)
            .setLabel(STATIONS[i].name)
            .setStyle(i === currentStation ? ButtonStyle.Success : ButtonStyle.Secondary)
            .setEmoji('📻')
        );
      }
    }
    rows.push(row);
  }
  return rows;
}

// --------------------------- Ortak oynatıcı mantığı ---------------------
async function playInChannel(voiceChannel, notify = (t) => {}) {
  // Eski bağlantıyı güvenli kapat
  if (connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
    try { connection.destroy(); } catch {}
    connection = null;
  }

  notify('🔊 Ses kanalına bağlanılıyor…');

  connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator
  });

  // Voice hazır olana kadar bekle
  await entersState(connection, VoiceConnectionStatus.Ready, 8000);
  notify('📻 Bağlandı. En hızlı yayın aranıyor…');

  // Aktif istasyonun en hızlı URL'sini seç
  const urls = STATIONS[currentStation].urls;
  const fastestIdx = await pickFastestRadioUrl(urls, currentUrlIndex, 1200, 1800);
  currentUrlIndex = fastestIdx;

  // Player kur/temizle
  if (player) { try { player.stop(true); } catch {} player = null; }
  player = createAudioPlayer();

  player.on(AudioPlayerStatus.Playing, () => {
    isPlaying = true;
    console.log(`🎵 Radyo çalmaya başladı! (${STATIONS[currentStation].name})`);
    notify(`🎵 **${STATIONS[currentStation].name}** başladı! Keyifli dinlemeler 🎶`);
  });

  player.on(AudioPlayerStatus.Paused, () => {
    isPlaying = false;
    console.log('⏸️ Radyo duraklatıldı');
  });

  player.on(AudioPlayerStatus.Idle, () => {
    if (!isCleaning) {
      isPlaying = false;
      console.log('⏹️ Radyo durdu (Idle)');
    }
  });

  player.on('error', (error) => {
    console.error('Player hatası:', error);
    safeCleanup();
    notify('❌ Stream hatası oluştu, tekrar dene.');
  });

  // Kaynak (paketsiz)
  const resource = await createAudioResourceFromUrl(urls[currentUrlIndex]);
  resource.volume?.setVolume(0.5);

  player.play(resource);
  connection.subscribe(player);
}

// --------------------------- Komut İşlevleri ----------------------------
async function handlePlay(message) {
  const voiceChannel = message.member?.voice?.channel;
  if (!voiceChannel) return message.reply('❌ Önce bir ses kanalına katılmalısın!');
  if (isPlaying && connection) return message.reply('🎵 Radyo zaten çalıyor!');

  try {
    const infoMsg = await message.reply('🔊 Ses kanalına bağlanılıyor…');

    await playInChannel(voiceChannel, (txt) => {
      try { infoMsg.edit(txt); } catch {}
    });

  } catch (error) {
    console.error('Play komutu hatası:', error);
    message.reply('❌ Radyo başlatılamadı: ' + (error?.message || error));
    safeCleanup();
  }
}

async function handlePause(message) {
  if (!player || !isPlaying) return message.reply('❌ Şu anda çalan bir radyo yok!');
  try { player.pause(); } catch {}
  message.reply('⏸️ Radyo duraklatıldı.');
}

async function handleStop(message) {
  if (!connection && !player) return message.reply('❌ Şu anda çalan bir radyo yok!');
  safeCleanup();
  message.reply('⏹️ Radyo durduruldu ve ses kanalından ayrıldı.');
}

async function handlePing(message) {
  const m = await message.reply('🏓 Ping ölçülüyor...');
  const apiLatency = Math.round(client.ws.ping);
  const botLatency = Math.max(0, m.createdTimestamp - message.createdTimestamp);
  m.edit(`🏓 **Pong!**\n📡 Bot: \`${botLatency}ms\`\n🌐 API: \`${apiLatency}ms\``);
}

async function handleHelp(message) {
  message.reply({
    embeds: [{
      color: 0x0099ff,
      title: '🎵 XATSU Radyo Bot Komutları',
      description: '**Türk radyo istasyonlarını Discord\'da dinle!**',
      fields: [
        { 
          name: '🎛️ **Ana Komutlar**', 
          value: '`!play` - Radyoyu başlat\n`!pause` - Radyoyu duraklat\n`!stop` - Radyoyu durdur ve çık\n`!radyo` - 📻 İstasyon seçici (2x2 grid)', 
          inline: false 
        },
        { 
          name: '📊 **Bilgi Komutları**', 
          value: '`!status` - Bot durumunu göster\n`!radio` - Aktif istasyon bilgisi\n`!ping` - Gecikmeleri ölç', 
          inline: false 
        },
        { 
          name: '⚙️ **Diğer**', 
          value: '`!switchurl` - URL değiştir (gelişmiş)\n`!test` - Bot test et\n`!help` - Bu menüyü göster', 
          inline: false 
        },
        {
          name: '📻 **Mevcut İstasyonlar**',
          value: `${STATIONS.map((s, i) => `${i+1}. ${s.name}`).join('\n')}`,
          inline: false
        }
      ],
      footer: { text: 'XATSU Radio Bot • Keyifli dinlemeler!' },
      timestamp: new Date()
    }]
  });
}

// ------------------------- Kaynak Oluşturucu ----------------------------
async function createAudioResourceFromUrl(url) {
  // URL string doğrudan createAudioResource'a veriliyor (inlineVolume açık)
  // inputType belirtmiyoruz; discordjs/voice kendisi tahmin eder.
  return createAudioResource(url, {
    inputType: StreamType.Arbitrary,
    inlineVolume: true,
    metadata: { title: STATIONS[currentStation].name }
  });
}

// ----------------------------- Temizlik ---------------------------------
function safeCleanup() {
  if (isCleaning) return;
  isCleaning = true;

  try {
    if (player) {
      try { player.stop(true); } catch {}
      player.removeAllListeners();
      player = null;
    }

    if (connection) {
      try {
        if (connection.state.status !== VoiceConnectionStatus.Destroyed) {
          connection.destroy(); // güvenli destroy
        }
      } catch {}
      try { connection.removeAllListeners(); } catch {}
      connection = null;
    }

    isPlaying = false;
    console.log('🧹 Temizlik tamamlandı');
  } catch (err) {
    console.error('Temizlik hatası (yoksayılabilir):', err?.message || err);
  } finally {
    isCleaning = false;
  }
}

// -------------------------- Buton Tıklama (2x2) -------------------------
client.on('interactionCreate', async (i) => {
  if (!i.isButton()) return;
  if (!i.customId.startsWith('radio:')) return;

  const idx = Number(i.customId.split(':')[1]);
  if (Number.isNaN(idx) || !STATIONS[idx]) {
    return i.reply({ content: '❌ Geçersiz seçim.', ephemeral: true });
  }

  const member = await i.guild.members.fetch(i.user.id);
  const vch = member?.voice?.channel;
  if (!vch) return i.reply({ content: '❌ Önce bir ses kanalına katılman gerekiyor!', ephemeral: true });

  try {
    // Önceki durumu temizle
    safeCleanup();
    
    // Yeni istasyon ayarla
    currentStation = idx;
    currentUrlIndex = 0; // yeni istasyonda ilk URL'den başla
    
    await i.deferUpdate(); // Butonları hemen güncelle
    
    await playInChannel(vch, () => {});
    
    await i.editReply({
      content: `🎵 **${STATIONS[currentStation].name}** çalıyor! 🎶\n📻 Başka bir istasyon seçmek için butona tıkla.`,
      components: stationButtons()
    });
  } catch (e) {
    console.error(e);
    if (i.deferred || i.replied) {
      await i.editReply({ 
        content: `❌ **${STATIONS[idx].name}** başlatılamadı. Tekrar dene.`, 
        components: stationButtons() 
      });
    } else {
      await i.reply({ content: '❌ İstasyon başlatılamadı.', ephemeral: true });
    }
  }
});

// -------------------------- Process Handler'lar -------------------------
process.on('SIGINT', () => {
  console.log('🛑 Bot kapatılıyor (SIGINT)...');
  safeCleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Bot kapatılıyor (SIGTERM)...');
  safeCleanup();
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  console.error('Yakalanmamış hata (Promise):', error);
});

process.on('uncaughtException', (error) => {
  console.error('Yakalanmamış exception:', error);
});

// ------------------------------ Login -----------------------------------
async function startBot() {
  const maxRetries = 5;
  for (let i = 1; i <= maxRetries; i++) {
    try {
      console.log(`🔐 Discord'a bağlanılıyor... (Deneme ${i}/${maxRetries})`);
      console.log('⏳ Lütfen bekleyin, bu işlem 1-2 dakika sürebilir...');
      await client.login(process.env.DISCORD_TOKEN);
      console.log('✅ Discord bağlantısı başarılı!');
      return;
    } catch (err) {
      console.error(`❌ Bağlantı hatası (Deneme ${i}):`, err?.message || err);
      if (i === maxRetries) {
        console.error('❌ Maksimum deneme sayısı aşıldı. Çıkılıyor.');
        process.exit(1);
      }
      const waitMs = 10000 + i * 5000; // 10s, 15s, 20s, ...
      console.log(`⏳ ${Math.round(waitMs/1000)} saniye bekleniyor...`);
      await new Promise(r => setTimeout(r, waitMs));
    }
  }
}
startBot();
// ========================================================================