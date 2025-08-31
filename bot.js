// ===================== XATSU RADIO BOT (Gelişmiş Sürüm) =====================

// Console çıktısını temizle
console.clear();
console.log(`
================= XATSU RADIO BOT =================
🎵 Bot başlatılıyor...
📅 ${new Date().toLocaleString('tr-TR')}
====================================================
`);

// Uyarıları ve deprecation mesajlarını tamamen sustur
const originalEmit = process.emit;
process.emit = function (name, data) {
  if (name === 'warning') return false;
  if (name === 'deprecation') return false;
  return originalEmit.apply(process, arguments);
};

// Console.warn'ları da sustur
const originalWarn = console.warn;
console.warn = function(...args) {
  const message = args.join(' ');
  if (message.includes('DeprecationWarning') || 
      message.includes('ready event') || 
      message.includes('clientReady')) {
    return;
  }
  originalWarn.apply(console, arguments);
};

// --------------------- HTTP(Client) / Undici Ayarı ----------------------
const { setGlobalDispatcher, Agent, request } = require('undici');

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
    globalRequestsPerSecond: 50
  }
});

// ------------------------------ İstasyonlar (2x2) ---------------------------------
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
let currentStation = 0;
let currentUrlIndex = 0;
let connection = null;
let player = null;
let isPlaying = false;
let isCleaning = false;
let autoChannel = null; // Oto-play kanalı
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

// ------------------------------ Ready -----------------------------------
client.once('ready', async () => {
  console.log(`✅ Bot aktif: ${client.user.tag}`);
  console.log(`📊 Sunucu sayısı: ${client.guilds.cache.size}`);
  console.log('====================================================');
  
  client.user.setActivity('🎵 Radyo Yayını', { type: 'LISTENING' });

  // ======= OTO-PLAY =======
  if (process.env.AUTOPLAY === '1' && process.env.GUILD_ID && process.env.VOICE_CHANNEL_ID) {
    try {
      console.log('🔄 Otomatik radyo başlatılıyor...');
      const guild = await client.guilds.fetch(process.env.GUILD_ID);
      const voiceChannel = await guild.channels.fetch(process.env.VOICE_CHANNEL_ID);
      
      if (voiceChannel && voiceChannel.isVoiceBased()) {
        autoChannel = voiceChannel;
        await playInChannel(voiceChannel);
        
        // Oto-play başarılıysa grid mesajı gönder
        const textChannels = guild.channels.cache.filter(ch => ch.type === 0);
        const firstTextChannel = textChannels.first();
        
        if (firstTextChannel) {
          await firstTextChannel.send({
            content: `🎵 **${STATIONS[currentStation].name}** yayında!`,
            components: stationButtons()
          });
        }
        
        console.log('✅ Otomatik radyo başlatıldı');
      }
    } catch (e) {
      console.log('⚠️ Otomatik başlatma hatası:', e?.message);
    }
  }
});

// ---------------------------- Olaylar (temiz log) -----------------------------
client.on('shardError', (e) => console.log('🔄 Bağlantı sorunu, yeniden deneniyor...'));
client.on('shardReconnecting', () => console.log('🔄 Discord bağlantısı yenileniyor...'));
client.on('shardResume', () => console.log('✅ Bağlantı yeniden kuruldu'));

// Auto-reconnect sistemi
setInterval(async () => {
  if (autoChannel && (!connection || connection.state.status === VoiceConnectionStatus.Disconnected)) {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      try {
        console.log('🔄 Radyo yeniden bağlanıyor...');
        await playInChannel(autoChannel);
        reconnectAttempts = 0;
      } catch (e) {
        reconnectAttempts++;
        console.log(`⚠️ Yeniden bağlantı denemesi ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
      }
    }
  }
  
  // Player durumu kontrolü
  if (player && player.state.status === AudioPlayerStatus.Idle && isPlaying) {
    console.log('🔄 Stream kesildi, yeniden başlatılıyor...');
    if (autoChannel) {
      try {
        await playInChannel(autoChannel);
      } catch (e) {
        console.log('⚠️ Stream yeniden başlatılamadı');
      }
    }
  }
}, 10000); // Her 10 saniyede kontrol

// ---------------------------- Komutlar ----------------------------------
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const command = message.content.trim().toLowerCase();

  try {
    switch (command) {
      case '!play': await handlePlay(message); break;
      case '!pause': await handlePause(message); break;
      case '!stop':  await handleStop(message); break;
      case '!ping':  await handlePing(message); break;
      case '!help':  await handleHelp(message); break;
      case '!test':  message.reply('✅ Bot çalışıyor!'); break;
      case '!status':
        message.reply(
          `📊 **Bot Durumu**\n` +
          `🎵 Radyo: ${isPlaying ? 'Çalıyor' : 'Durmuş'}\n` +
          `📻 İstasyon: ${STATIONS[currentStation].name}\n` +
          `🔊 Bağlantı: ${connection ? 'Aktif' : 'Yok'}\n` +
          `⏰ Çalışma: ${Math.floor(process.uptime()/60)} dk`
        );
        break;
      case '!radio':
        message.reply(`📻 **${STATIONS[currentStation].name}** çalıyor`);
        break;
      case '!radyo':
        await message.reply({
          content: `🎛️ **Radyo İstasyonu Seçimi**`,
          components: stationButtons()
        });
        break;
    }
  } catch (err) {
    console.log('❌ Komut hatası:', err?.message);
    message.reply('❌ Bir hata oluştu.');
  }
});

// --------------------------- Hızlı URL Seçici -----------------
async function pickFastestRadioUrl(candidates, fallbackIndex = 0, timeout = 1500) {
  const controllers = [];
  let overallTimer;

  const testUrl = (url, idx) => new Promise(async (resolve, reject) => {
    const ac = new AbortController();
    controllers.push(ac);
    const t = setTimeout(() => ac.abort(), timeout);
    
    try {
      const res = await request(url, {
        method: 'HEAD',
        headers: { 'User-Agent': 'RadioBot/1.0' },
        signal: ac.signal
      });
      
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(idx);
      } else {
        reject(new Error('bad status'));
      }
    } catch (e) {
      reject(e);
    } finally {
      clearTimeout(t);
    }
  });

  try {
    const tests = candidates.map((url, idx) => testUrl(url, idx));
    const winner = await Promise.any(tests);
    
    controllers.forEach(c => { try { c.abort(); } catch {} });
    return winner;
  } catch {
    controllers.forEach(c => { try { c.abort(); } catch {} });
    return fallbackIndex;
  }
}

// --------------------------- 2x2 Buton Oluşturucu -----------------------
function stationButtons() {
  const rows = [];
  
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

// --------------------------- Oynatıcı Mantığı ---------------------
async function playInChannel(voiceChannel) {
  // Temizlik
  if (connection && connection.state.status !== VoiceConnectionStatus.Destroyed) {
    try { connection.destroy(); } catch {}
    connection = null;
  }

  connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator
  });

  await entersState(connection, VoiceConnectionStatus.Ready, 8000);

  // En hızlı URL seç
  const urls = STATIONS[currentStation].urls;
  const fastestIdx = await pickFastestRadioUrl(urls, currentUrlIndex);
  currentUrlIndex = fastestIdx;

  // Player kur
  if (player) { try { player.stop(true); } catch {} player = null; }
  player = createAudioPlayer();

  player.on(AudioPlayerStatus.Playing, () => {
    isPlaying = true;
    console.log(`🎵 ${STATIONS[currentStation].name} çalıyor`);
  });

  player.on(AudioPlayerStatus.Paused, () => {
    isPlaying = false;
  });

  player.on(AudioPlayerStatus.Idle, () => {
    if (!isCleaning) {
      isPlaying = false;
    }
  });

  player.on('error', (error) => {
    console.log('⚠️ Stream hatası, yeniden başlatılıyor...');
    setTimeout(() => {
      if (autoChannel) playInChannel(autoChannel);
    }, 2000);
  });

  const resource = createAudioResource(urls[currentUrlIndex], {
    inputType: StreamType.Arbitrary,
    inlineVolume: true
  });
  
  resource.volume?.setVolume(0.6);
  player.play(resource);
  connection.subscribe(player);
}

// --------------------------- Komut İşlevleri ----------------------------
async function handlePlay(message) {
  const voiceChannel = message.member?.voice?.channel;
  if (!voiceChannel) return message.reply('❌ Ses kanalına katıl!');
  if (isPlaying && connection) return message.reply('🎵 Radyo çalıyor!');

  try {
    autoChannel = voiceChannel; // Auto-reconnect için kaydet
    await playInChannel(voiceChannel);
    message.reply(`🎵 **${STATIONS[currentStation].name}** başlatıldı!`);
  } catch (error) {
    message.reply('❌ Radyo başlatılamadı');
  }
}

async function handlePause(message) {
  if (!player || !isPlaying) return message.reply('❌ Çalan radyo yok!');
  try { player.pause(); } catch {}
  message.reply('⏸️ Radyo duraklatıldı');
}

async function handleStop(message) {
  if (!connection && !player) return message.reply('❌ Çalan radyo yok!');
  autoChannel = null; // Auto-reconnect'i durdur
  safeCleanup();
  message.reply('⏹️ Radyo durduruldu');
}

async function handlePing(message) {
  const m = await message.reply('🏓 Ölçülüyor...');
  const apiLatency = Math.round(client.ws.ping);
  const botLatency = Math.max(0, m.createdTimestamp - message.createdTimestamp);
  m.edit(`🏓 **Ping**\n📡 Bot: ${botLatency}ms\n🌐 API: ${apiLatency}ms`);
}

async function handleHelp(message) {
  message.reply({
    embeds: [{
      color: 0x0099ff,
      title: '🎵 XATSU Radyo Bot',
      fields: [
        { 
          name: '🎛️ Ana Komutlar', 
          value: '`!play` Radyo başlat\n`!pause` Duraklat\n`!stop` Durdur\n`!radyo` İstasyon seçici', 
          inline: true 
        },
        { 
          name: '📊 Bilgi', 
          value: '`!status` Durum\n`!radio` Aktif istasyon\n`!ping` Gecikme', 
          inline: true 
        },
        {
          name: '📻 İstasyonlar',
          value: STATIONS.map((s, i) => `${i+1}. ${s.name}`).join('\n'),
          inline: false
        }
      ],
      footer: { text: 'XATSU Radio Bot' }
    }]
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
          connection.destroy();
        }
      } catch {}
      connection = null;
    }

    isPlaying = false;
  } catch (err) {
    console.log('⚠️ Temizlik hatası');
  } finally {
    isCleaning = false;
  }
}

// -------------------------- Buton Tıklama (2x2) -------------------------
client.on('interactionCreate', async (i) => {
  if (!i.isButton() || !i.customId.startsWith('radio:')) return;

  const idx = Number(i.customId.split(':')[1]);
  if (Number.isNaN(idx) || !STATIONS[idx]) {
    return i.reply({ content: '❌ Geçersiz seçim', ephemeral: true });
  }

  const member = await i.guild.members.fetch(i.user.id);
  const vch = member?.voice?.channel;
  if (!vch) return i.reply({ content: '❌ Ses kanalına katıl!', ephemeral: true });

  try {
    safeCleanup();
    currentStation = idx;
    currentUrlIndex = 0;
    autoChannel = vch; // Auto-reconnect için kaydet
    
    await i.deferUpdate();
    await playInChannel(vch);
    
    await i.editReply({
      content: `🎵 **${STATIONS[currentStation].name}** çalıyor!`,
      components: stationButtons()
    });
  } catch (e) {
    if (i.deferred || i.replied) {
      await i.editReply({ 
        content: `❌ **${STATIONS[idx].name}** başlatılamadı`, 
        components: stationButtons() 
      });
    }
  }
});

// -------------------------- Process Handler'lar -------------------------
process.on('SIGINT', () => {
  console.log('\n🛑 Bot kapatılıyor...');
  safeCleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Bot kapatılıyor...');
  safeCleanup();
  process.exit(0);
});

process.on('unhandledRejection', () => {}); // Sustur
process.on('uncaughtException', () => {}); // Sustur

// ------------------------------ Login -----------------------------------
async function startBot() {
  const maxRetries = 3;
  for (let i = 1; i <= maxRetries; i++) {
    try {
      console.log(`🔐 Discord'a bağlanılıyor... (${i}/${maxRetries})`);
      await client.login(process.env.DISCORD_TOKEN);
      return;
    } catch (err) {
      console.log(`❌ Bağlantı hatası (Deneme ${i}):`, err?.message);
      if (i === maxRetries) {
        console.log('❌ Bağlantı başarısız, çıkılıyor');
        process.exit(1);
      }
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}
startBot();
// ========================================================================