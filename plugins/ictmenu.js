const os = require("os");
const moment = require("moment-timezone");
const axios = require("axios");
const config = require('../settings');
const fs = require('fs');
const { cmd, commands } = require('../lib/command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson, jsonformat} = require('../lib/functions')

var amsg =''
if(config.LANG === 'SI') amsg = 'බොට් ආරක්ෂිතව සජීවිකර ඇතිද නැද්ද පරීක්‍ෂා කරන්න.'
else amsg = "Check bot online or no."

var pmsg =''
if(config.LANG === 'SI') pmsg = 'එය Bot වේගය පරීක්ශාකරයි.'
else pmsg = "Check bot's speed."

var mmsg =''
if(config.LANG === 'SI') mmsg = 'එය Bot විදාන ලැයිස්තුව ලබාදෙයි.'
else mmsg = "Get bot's command list."
;
var smsg =''
if(config.LANG === 'SI') smsg = 'එය Bot link ලබා දෙයි.'
else smsg = "It gives bot link."

var nmsg =''
if(config.LANG === 'SI') nmsg = 'එය Bot ගැන කෙටි විස්තරයක් ලබා දෙයි.'
else nmsg = "It gives bot shot information."


var ssmsg =''
if(config.LANG === 'SI') ssmsg = 'එය Bot පද්දතියේ විස්තර ලබා දෙයි.'
else ssmsg = "Get bot's system information."

var omsg =''
if(config.LANG === 'SI') omsg = 'එය Bot නිර්මාතෘන්ගේ නම්බර් ලබා දෙයි.'
else omsg = "Get bot's owners number."

var cmsg =''
if(config.LANG === 'SI') cmsg = 'එය Bot ප්‍රදාන සමූහය ලබා දෙයි.'
else cmsg = "Get bot official channel."

var bmsg =''
if(config.LANG === 'SI') bmsg = 'එකම Message එක ශාල ප්‍රමානයක් යැවීමට.'
else bmsg = "Send a message multiple times."

var vvmsg =''
if(config.LANG === 'SI') vvmsg = 'එක පාරක් බලන Message ගන්න.'
else vvmsg = "Get View One Message."

var aamsg =''
if(config.LANG === 'SI') aamsg = 'ක්‍රියාකාරි Session ගනන ලබා දෙයි.'
else aamsg = "Get Active Session Count."

var sudesc =''
if(config.LANG === 'SI') sudesc = 'බොට්ගේ යාවත්කාලීන කිරීම් නැරබීමට.'
else sudesc = "Show bot updates."




var vrepmsg =''
if(config.LANG === 'SI') vrepmsg = '*📛 View One Message එකකට Reply කරන්න.*'
else vrepmsg = "*📛 Reply View One Message.*"

var repmsg =''
if(config.LANG === 'SI') repmsg = '*📛 ඔබ හිමිකරුවකු නොවේ.*'
else repmsg = "*📛 You are not the owners.*"

var brormsg =''
if(config.LANG === 'SI') brormsg = '*📛 කරුනාකර වචනයක් දෙන්න.*'
else brormsg = "*📛 Please Give me a text.*"

//--------------- BOT' S MENU ------------------//
cmd({
  pattern: "menu",
  alias: ["list", "commands"],
  react: "🗃️",
  desc: mmsg,
  category: "main",
  filename: __filename
}, async (conn, mek, q, { from, prefix, pushname, reply }) => {
  try {
    
    let ping = await conn.sendMessage(from, { text: '`LOADING`' }, { quoted: mek });
    await conn.sendMessage(from, { text: '`WELCOME PASINDU ATHUKORALA ICT ASSISTANT`', edit: ping.key });

    let hostname;
    const hostLen = os.hostname().length;
    if (hostLen === 12) hostname = "Replit";
    else if (hostLen === 36) hostname = "Heroku";
    else if (hostLen === 8) hostname = "Koyeb";
    else hostname = os.hostname();
   
    const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const ramTotal = Math.round(os.totalmem() / 1024 / 1024);
    const uptime = runtime(process.uptime());

    const date = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
    const time = moment().tz("Asia/Colombo").format("HH:mm:ss");

    const ownerdata = (await axios.get(
      "https://raw.githubusercontent.com/Nethmika-LK/Shala-MD-Database/refs/heads/main/Ditelse.json"
    )).data;

    const {
      alivemsg, footer, imageurl, alivevideo,
      version, botname, ownername, ownernumber,
      pairlink, header, platform
    } = ownerdata;

 
const menuMessage = `*Pasindu Athukorala ICT* · Study Assistant
─────────────────────────

📂 *PDF BANK & STUDY NOTES*
─────────────────────────

පහත දැක්වෙන commands භාවිතයෙන් ඔබට අවශ්‍ය නිබන්ධන/සටහන් සෘජුවම ලබාගත හැක:
_(Use the commands below to download the specific PDF directly)_

• `!note lesson01` — *Introduction to ICT*
• `!note eoc` — *Evolution Of ICT*
• `!note nettheory` — *networking theory*
• `!note logicgate` — *Logic Gates*
• `!note ospt1` — *Operating System - Part 01*
• `!note ospt2` — *Operating System - Part 02*
• `!note htmltute` — *HTML Tute*
• `!note htmlnote` — *HTML Note*
• `!note csstute` — *CSS Tute*
• `!note cssnote` — *CSS Note*
• `!note booleanlaws` — *Boolean laws and K-maps*
• `!note pysem01` — *Python Seminar - Day 01*
• `!note pysem02` — *Python Seminar - Day 02*
• `!note pysem03` — *Python Seminar - Day 03*
• `!note pysem04` — *Python Seminar - Day 04*
• `!note ossem26` — *OS Seminar - 2026 A/L*
• `!note pysem05` — *Python Seminar - Day 05*
• `!note pysem06` — *Python Seminar - Day 06 (Last Day)*

─────────────────────────
_Just type the command (e.g. `!note lesson01`) in the chat._

_Pasindu Athukorala ICT Team_

─────────────────────────
_Pasindu Athukorala ICT Team_`;

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

//--------------- BOT' S OWNER ------------------//
cmd({
    pattern: "owner",
    desc: omsg,
    category: "main",
	react: "👨‍💻",
    use: '.owner',
    alias: ["head"],
    filename: __filename,
}, 

async (conn, mek, m, { from, quoted, reply }) => {
    try {

		const ownerdata = (await axios.get(
      "https://raw.githubusercontent.com/Nethmika-LK/Shala-MD-Database/refs/heads/main/Ditelse.json"
    )).data;

    const {
      alivemsg, footer, imageurl, alivevideo,
      version, botname, ownername, ownernumber,
      pairlink, header, platform
    } = ownerdata;

		const shala = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: botname,
                    vcard: 
`BEGIN:VCARD
VERSION:3.0
N:;${botname};;;
FN:${botname}
TEL;waid=94704227534:+94704227534
END:VCARD`
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
                displayName: "BOT/S HELPERS",
                contacts: [
                    { vcard: vcard1 },
                    { vcard: vcard2 },
                    { vcard: vcard3 }
                ]
            }
        }, { quoted: shala });        

    } catch (e) {
        console.log(e);
        reply(`*🚩 Owner Error :-*\n${e}`);
    }
});
