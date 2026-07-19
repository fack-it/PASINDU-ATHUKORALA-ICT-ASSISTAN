const os = require("os");
const moment = require("moment-timezone");
const axios = require("axios");
const config = require('../settings');
const fs = require('fs');
const { cmd, commands } = require('../lib/command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, jsonformat } = require('../lib/functions')

// --- Language Configurations ---
var mmsg = config.LANG === 'SI' ? 'එය Bot විදාන ලැයිස්තුව ලබාදෙයි.' : "Get bot's command list.";
var omsg = config.LANG === 'SI' ? 'එය Bot නිර්මාතෘන්ගේ නම්බර් ලබා දෙයි.' : "Get bot's owners number.";
var nmsg = config.LANG === 'SI' ? 'ICT සටහන් සහ නිබන්ධන ලබා ගැනීමට.' : "Get ICT notes and tutorials.";

// --- ICT Notes & PDF URL Mapping ---
// You can replace the dummy URLs below with your actual direct download links (Google Drive, mediafire, or github hosting)
const NOTES_MAP = {
  "lesson01": { title: "Introduction to ICT", url: "https://example.com/pdf/lesson01.pdf" },
  "eoc": { title: "Evolution of ICT", url: "https://example.com/pdf/eoc.pdf" },
  "nettheory": { title: "Networking Theory", url: "https://example.com/pdf/nettheory.pdf" },
  "logicgate": { title: "Logic Gates", url: "https://example.com/pdf/logicgates.pdf" },
  "ospt1": { title: "Operating System - Part 01", url: "https://example.com/pdf/os_part1.pdf" },
  "ospt2": { title: "Operating System - Part 02", url: "https://example.com/pdf/os_part2.pdf" },
  "htmltute": { title: "HTML Tute", url: "https://example.com/pdf/html_tute.pdf" },
  "htmlnote": { title: "HTML Note", url: "https://example.com/pdf/html_note.pdf" },
  "csstute": { title: "CSS Tute", url: "https://example.com/pdf/css_tute.pdf" },
  "cssnote": { title: "CSS Note", url: "https://example.com/pdf/css_note.pdf" },
  "booleanlaws": { title: "Boolean Laws and K-maps", url: "https://example.com/pdf/boolean_laws.pdf" },
  "pysem01": { title: "Python Seminar - Day 01", url: "https://example.com/pdf/py_sem01.pdf" },
  "pysem02": { title: "Python Seminar - Day 02", url: "https://example.com/pdf/py_sem02.pdf" },
  "pysem03": { title: "Python Seminar - Day 03", url: "https://example.com/pdf/py_sem03.pdf" },
  "pysem04": { title: "Python Seminar - Day 04", url: "https://example.com/pdf/py_sem04.pdf" },
  "ossem26": { title: "OS Seminar - 2026 A/L", url: "https://example.com/pdf/os_sem26.pdf" },
  "pysem05": { title: "Python Seminar - Day 05", url: "https://example.com/pdf/py_sem05.pdf" },
  "pysem06": { title: "Python Seminar - Day 06 (Last Day)", url: "https://example.com/pdf/py_sem06.pdf" }
};

//--------------- BOT'S MENU ------------------//
cmd({
  pattern: "menu",
  alias: ["list", "commands"],
  react: "🗃️",
  desc: mmsg,
  category: "main",
  filename: __filename
}, async (conn, mek, q, { from, prefix, pushname, reply }) => {
  try {
    // Elegant system stats preparation
    const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const ramTotal = Math.round(os.totalmem() / 1024 / 1024);
    const uptime = runtime(process.uptime());
    const date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
    const time = moment().tz("Asia/Colombo").format("HH:mm:ss");

    let ping = await conn.sendMessage(from, { text: '`⏱️ PROCESSING...`' }, { quoted: mek });
    await conn.sendMessage(from, { text: '`👋 WELCOME PASINDU ATHUKORALA ICT ASSISTANT`', edit: ping.key });

    // Safe API Fetching with Fallback values
    let imageurl = "https://i.imgur.com/example.jpg"; // Fallback default image
    try {
      const response = await axios.get("https://raw.githubusercontent.com/Nethmika-LK/Shala-MD-Database/refs/heads/main/Ditelse.json", { timeout: 5000 });
      if (response.data && response.data.imageurl) {
        imageurl = response.data.imageurl;
      }
    } catch (apiErr) {
      console.warn("Could not retrieve online database configuration, using default settings.");
    }
 
    const menuMessage = `*Pasindu Athukorala ICT* · Study Assistant
─────────────────────────
📟 *SYSTEM STATUS*
• *Date:* ${date} | *Time:* ${time}
• *Uptime:* ${uptime}
• *RAM:* ${ramUsed}MB / ${ramTotal}MB
─────────────────────────

📂 *PDF BANK & STUDY NOTES*
─────────────────────────

පහත දැක්වෙන commands භාවිතයෙන් ඔබට අවශ්‍ය නිබන්ධන/සටහන් සෘජුවම ලබාගත හැක:
_(Use the commands below to download the specific PDF directly)_

• \`${prefix}note lesson01\` — *Introduction to ICT*
• \`${prefix}note eoc\` — *Evolution Of ICT*
• \`${prefix}note nettheory\` — *networking theory*
• \`${prefix}note logicgate\` — *Logic Gates*
• \`${prefix}note ospt1\` — *Operating System - Part 01*
• \`${prefix}note ospt2\` — *Operating System - Part 02*
• \`${prefix}note htmltute\` — *HTML Tute*
• \`${prefix}note htmlnote\` — *HTML Note*
• \`${prefix}note csstute\` — *CSS Tute*
• \`${prefix}note cssnote\` — *CSS Note*
• \`${prefix}note booleanlaws\` — *Boolean laws and K-maps*
• \`${prefix}note pysem01\` — *Python Seminar - Day 01*
• \`${prefix}note pysem02\` — *Python Seminar - Day 02*
• \`${prefix}note pysem03\` — *Python Seminar - Day 03*
• \`${prefix}note pysem04\` — *Python Seminar - Day 04*
• \`${prefix}note ossem26\` — *OS Seminar - 2026 A/L*
• \`${prefix}note pysem05\` — *Python Seminar - Day 05*
• \`${prefix}note pysem06\` — *Python Seminar - Day 06 (Last Day)*

─────────────────────────
_Just type the command (e.g. \`${prefix}note lesson01\`) in the chat._

_Pasindu Athukorala ICT Team_
─────────────────────────`;

    await conn.sendMessage(from, {
      image: { url: imageurl },
      caption: menuMessage,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: false
      }
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`*🚩 Menu Error :-*\n${e.message}`);
  }
});

//--------------- DYNAMIC NOTE COMMAND ------------------//
cmd({
  pattern: "note",
  alias: ["pdf", "tute"],
  react: "📚",
  desc: nmsg,
  category: "education",
  use: '.note <note_code>',
  filename: __filename
}, async (conn, mek, q, { from, reply }) => {
  try {
    if (!q) {
      return reply(`*🚩 Please enter a note code!*\nExample: \`.note lesson01\`\n\nUse \`.menu\` to see all available note codes.`);
    }

    const noteKey = q.trim().toLowerCase();
    const selectedNote = NOTES_MAP[noteKey];

    if (!selectedNote) {
      return reply(`*🚩 Invalid note code!* "${q}" is not recognized.\nUse \`.menu\` to see the list of valid codes.`);
    }

    await reply(`*📥 Downloading "${selectedNote.title}"... Please wait.*`);

    // Sends the note as a document file to the user
    await conn.sendMessage(from, {
      document: { url: selectedNote.url },
      mimetype: 'application/pdf',
      fileName: `${selectedNote.title}.pdf`,
      caption: `*✨ here is your requested study material!*\n\n📚 *Topic:* ${selectedNote.title}\n👨‍🏫 *Instructor:* Pasindu Athukorala\n\n_Keep studying! Pasindu Athukorala ICT Team_`
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply(`*🚩 Note Delivery Error :-*\nCould not retrieve the file. Make sure the database URL is active.`);
  }
});

//--------------- BOT'S OWNER ------------------//
cmd({
  pattern: "owner",
  desc: omsg,
  category: "main",
  react: "👨‍💻",
  use: '.owner',
  alias: ["head"],
  filename: __filename,
}, async (conn, mek, m, { from, reply }) => {
  try {
    let botname = "Pasindu Athukorala Assistant";
    try {
      const ownerdata = (await axios.get(
        "https://raw.githubusercontent.com/Nethmika-LK/Shala-MD-Database/refs/heads/main/Ditelse.json",
        { timeout: 5000 }
      )).data;
      if (ownerdata && ownerdata.botname) {
        botname = ownerdata.botname;
      }
    } catch (e) {
      console.warn("Owner details fetch failed, falling back to local defaults.");
    }

    const shala = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: botname,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${botname};;;\nFN:${botname}\nTEL;waid=94704227534:+94704227534\nEND:VCARD`
        }
      }
    };
		
    const vcard1 = 'BEGIN:VCARD\n'
        + 'VERSION:3.0\n' 
        + 'FN:ꜱʟ ɴᴇᴛʜᴜ ᴍᴀx\n'
        + 'ORG:ꜱʟ ɴᴇᴛʜᴜ ᴍᴀx\n'
        + 'TEL;type=CELL;type=VOICE;waid=94704227534:+94 70 422 7534\n'
        + 'EMAIL:nethumd65@gmail.com\n'
        + 'END:VCARD';

    const vcard2 = 'BEGIN:VCARD\n'
        + 'VERSION:3.0\n' 
        + 'FN:ɴᴇᴛʜᴍɪᴋᴀ ᴋᴀᴜꜱʜᴀʟʏᴀ\n'
        + 'ORG:ɴᴇᴛʜᴍɪᴋᴀ ᴋᴀᴜꜱʜᴀʟʏᴀ\n'
        + 'TEL;type=CELL;type=VOICE;waid=94741245331:+94 74 124 5331\n'
        + 'EMAIL:nethmikakaushalya10@gmail.com\n'
        + 'END:VCARD';

    const vcard3 = 'BEGIN:VCARD\n'
        + 'VERSION:3.0\n' 
        + 'FN:ɴᴇᴛʜᴍɪᴋᴀ ᴋᴀᴜꜱʜᴀʟʏᴀ\n'
        + 'ORG:ɴᴇᴛʜᴍɪᴋᴀ ᴋᴀᴜꜱʜᴀʟʏᴀ\n'
        + 'TEL;type=CELL;type=VOICE;waid=94787072548:+94 78 707 2548\n'
        + 'EMAIL:imalkahansamal@gmail.com\n'
        + 'END:VCARD';

    await conn.sendMessage(from, {
      contacts: {
        displayName: "BOT HELPERS",
        contacts: [
          { vcard: vcard1 },
          { vcard: vcard2 },
          { vcard: vcard3 }
        ]
      }
    }, { quoted: shala });        

  } catch (e) {
    console.error(e);
    reply(`*🚩 Owner Error :-*\n${e.message}`);
  }
});
