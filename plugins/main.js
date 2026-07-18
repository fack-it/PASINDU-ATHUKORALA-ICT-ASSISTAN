const config = require('../settings')
const os = require('os');
const moment = require("moment-timezone");
const { cmd, commands } = require('../lib/command')
const monospace = "```";


const date = moment.tz('Asia/Colombo').format('YYYY-MM-DD');
    const time = moment.tz('Asia/Colombo').format('HH:mm:ss');
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);


cmd({
    pattern: "ping",
    alias: ["speed","cyber_ping"],
    desc: "To Check bot's ping",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{ from, l, reply }) => {
try {
    // 🔥 Random React...
    const reacts = ["📟", "⚡", "🚀", "🛰️"];
    const randomReact = reacts[Math.floor(Math.random() * reacts.length)];
    await conn.sendMessage(from, { react: { text: randomReact, key: mek.key }});

    const inital = new Date().getTime();

    let pingingMsg, resultMsg;

    if (config.LANG === 'si') {
        pingingMsg = '*_Nelumi බොට් Ping කරන ගමන් ඉන්නේ..._* ❗'; // Sinhala
        resultMsg = (time) => `📍️ *Pong ${time} මිලි තත්පර*`;
    } else {
        pingingMsg = '*_Pinging to Nelumi Module..._* ❗';
        resultMsg = (time) => `📍️ *Pong ${time} Ms*`;
    }

    let ping = await conn.sendMessage(from , { text: pingingMsg });
    
    // ◍ Loading Animation
    const steps = ['◍○○○○', '◍◍○○○', '◍◍◍○○', '◍◍◍◍○', '◍◍◍◍◍'];
    for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 100)); // ඇනිමේෂන් එක
        await conn.sendMessage(from, { text: step, edit: ping.key });
    }

    const final = new Date().getTime();
    return await conn.sendMessage(from, { text: resultMsg(final - inital), edit: ping.key });

} catch (e) {
    reply(config.LANG === 'si' ? '*දෝෂයකි !!*' : '*Error !!*');
    l(e);
}
});


function formatUptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h}h ${m}m ${s}s`;
}

cmd(
  {
    pattern: "uptime",
    react: "⏱️",
    desc: "Show how long the bot has been running",
    category: "main",
    filename: __filename,
  },
  async (danuwa, mek, m, { reply }) => {
    const uptime = process.uptime(); // in seconds
    reply(`⏱️ *Bot Uptime:* ${formatUptime(uptime)}`);
  }
);


cmd({
    pattern: "system",
    alias: ["status", "botinfo"],
    desc: "To check bot system information.",
    category: "main",
    filename: __filename
},
async(conn, mek, m, { from, quoted, reply }) => {
    try {
        
        const reactions = ["⚙️", "📟"];
        for (const reaction of reactions) {
            await conn.sendMessage(from, { react: { text: reaction, key: mek.key } });
            await new Promise(resolve => setTimeout(resolve, 600));
        }

        // Uptime Calculation
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        // RAM & Storage Details
        const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(0);
        const freeRam = (os.freemem() / 1024 / 1024).toFixed(0);
        
   

        let sysMsg = `┌──❲ *NELUMI-SYSTEM-INFO* ❳
\`├⏰ Uptime\`:-  ${hours} hours, ${minutes} minutes, ${seconds} seconds
\`├🪫 Ram usage\`:-  ${ramUsage}MB / ${totalRam}MB
\`├⚙️ Platform\`:-  Earth 🌏
\`├📟 Free Ram\`:-  ${freeRam}MB
\`├🎈 Total Storage\`:- ${totalRam}MB
\`├👨‍💻 Owners\`:- 𝐒𝙰𝙽𝚄𝙹𝙰 𝐏𝙰𝙷𝙰𝚂𝙰𝚁𝙰
\`├🧬 Version\`:- 1.0.5
 *└─────────────────────*

*© 𝐏𝙾𝚆𝙴𝚁𝙳 𝐁𝚈 𝐐ᴜᴇᴇɴ 𝐍ᴇʟᴜᴍɪ 𝐌ᴅ* 🍭`;

        return await conn.sendMessage(from, { text: sysMsg }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
})

cmd(
  {
    pattern: "list",
    react: "📝",
    alias: ["help", "commands"],
    desc: "Show all available commands with total count",
    category: "main",
    filename: __filename,
  },
  async (danuwa, m, msg, { from, reply }) => {
    const commandMap = {};
    let totalCommands = 0;

    // Group commands by category
    for (const command of commands) {
      if (command.dontAddCommandList) continue;

      totalCommands++;
      const category = (command.category || "MISC").toUpperCase();
      if (!commandMap[category]) commandMap[category] = [];

      const patterns = [command.pattern, ...(command.alias || [])]
        .filter(Boolean)
        .map(p => `.${p}`);

      commandMap[category].push(patterns.join(", "));
    }

    let menuText = `
*𝐐ᴜᴇᴇɴ 𝐍ᴇʟ𝚞𝚖ɪ 𝐌ᴅ 🍭*
Total Commands: *${totalCommands}*
`;

    for (const category of Object.keys(commandMap).sort()) {
      menuText += `\n┣━━ ⪼ *${category}*\n`;
      menuText += commandMap[category].map(cmd => `┃🔸 ${cmd}`).join("\n") + "\n";
    }

    menuText += `╰━━━━━━━━━━━━━━━━━━━━━━⬣
`;

    await danuwa.sendMessage(from, { text: menuText }, { quoted: m });
  }
);

const menuImg = "https://files.catbox.moe/025xe2.jpg";

cmd({
    pattern: "menu",
    react: "🗂️",
    alias: ["panel", "help", "list"],
    desc: "Get bot command list.",
    category: "main",
    use: ".menu",
    filename: __filename
},
async (conn, mek, m, { from, quoted, reply }) => {
    try {

        const date = moment.tz('Asia/Colombo').format('YYYY-MM-DD');
        const time = moment.tz('Asia/Colombo').format('HH:mm:ss');
        const uptime = process.uptime();
        const uptimeString = `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`;
        const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        await conn.readMessages([mek.key]); 
        await conn.sendPresenceUpdate('composing', from); 
        await new Promise(resolve => setTimeout(resolve, 1500)); 

        const pushname = m.pushName || 'User';

        const categories = {
            '1': 'main',
            '2': 'download',
            '3': 'fun',
            '4': 'anime',
            '5': 'edit',
            '6': 'ai',
            '7': 'group',
            '8': 'logo',
            '9': 'tools',
            '10': 'search'
        };

        let desc = `*👋 Hello,* ${monospace}${pushname}${monospace} I'm Alive Now

*╭─『 NELUMI STATUS 』*
*│* 📅 *Date* : ${date}
*│* ⏰ *Time* : ${time}
*╰──────────────●●►*

*╭─『 NELUMI DETAILS 』*
*│* 👤 *User* : ${pushname}
*│* ✒️ *Prefix* : ${config.PREFIX}
*│* 🧬 *Version* : 1.0.5
*│* 📡 *Host* : AGAHARU
*│* 📟 *Uptime* : ${uptimeString}
*│* 📂 *Memory* : ${memory}MB
*╰──────────────●●►*  

* 🔢 Reply Below This Number

1 │❯❯◦ MAIN MENU
2 │❯❯◦ DOWNLOAD MENU
3 │❯❯◦ FUN MENU
4 │❯❯◦ ANIME MENU
5 │❯❯◦ EDIT MENU
6 │❯❯◦ AI MENU
7 │❯❯◦ GROUP MENU
8 │❯❯◦ LOGO MENU
8 │❯❯◦ TOOLS MENU
10 │❯❯◦ SEARCH MENU

*𝐐ᴜᴇᴇɴ 𝐍ᴇʟ𝚞𝚖ɪ 𝐌ᴅ 🍭*`;

        const vv = await conn.sendMessage(from, {
            image: { url: menuImg },
            caption: desc
        }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();
            const categoryName = categories[selectedOption];

            if (msg.message.extendedTextMessage.contextInfo &&
                msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {

                await conn.sendPresenceUpdate('composing', from);

                if (!categoryName) return reply("Invalid option. Please select a valid number🔴");

                let cmdList = "";
                commands.map((command) => {
                    if (command.category === categoryName) {
                        cmdList += `│ 💠 *.${command.pattern}*\n`;
                        cmdList += `│ ╰┈➤ _${command.desc || 'No description available'}_\n│\n`;
                    }
                });

                if (cmdList === "") cmdList = "│ ❌ No commands found.";

                let caption = `
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *RAM USAGE* - ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
│◈ *RUN TIME* - ${uptimeString}
│◈ *CATEGORY* - ${categoryName.toUpperCase()} MENU
╰──────────●●►
╭────────●●►
➠ *Total Commands:${cmdList}
╰────────●●►

*𝐐ᴜᴇᴇɴ 𝐍ᴇʟ𝚞𝚖ɪ 𝐌ᴅ 🍭*`;

                await conn.sendMessage(from, {
                    image: { url: menuImg },
                    caption: caption
                }, { quoted: msg });
            }
        });

    } catch (e) {
        console.error(e);
        reply('An error occurred: ' + e.message);
    }
});

cmd({
    pattern: "alive",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, pushname, reply, prefix}) => {
try{
    await conn.sendMessage(from, { react: { text: "👋", key: mek.key }});

    const date = moment.tz('Asia/Colombo').format('YYYY-MM-DD');
    const time = moment.tz('Asia/Colombo').format('HH:mm:ss');
    
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    
    let statusText = `*👋 Hello,* ${monospace}${pushname}${monospace} I'm Alive Now

*╭─『 NELUMI STATUS 』*
*│* 📅 *Date* : ${date}
*│* ⏰ *Time* : ${time}
*╰──────────────●●►*

*╭─『 NELUMI DETAILS 』*
*│* 👤 *User* : ${pushname}
*│* ✒️ *Prefix* : ${config.PREFIX}
*│* 🧬 *Version* : 1.0.0
*│* 📡 *Host* : AGAHARU
*│* 📟 *Uptime* : ${uptimeString}
*│* 📂 *Memory* : ${memory}MB
*╰──────────────●●►*

🔢 *Reply Below Number To Navigate*
 
1 │❯❯◦  Get Main Menu
2 │❯❯◦  Check Bot Speed
3 │❯❯◦  Contact Owner

*© 𝐏𝙾𝚆𝙴𝚁𝙳 𝐁𝚈 𝐐ᴜᴇᴇɴ 𝐍ᴇʟ𝚞𝚖ɪ 𝐌ᴅ* 🍭`

    const sentMsg = await conn.sendMessage(from, { 
        image: { url: config.ALIVE_IMG || "https://files.catbox.moe/025xe2.jpg" }, 
        caption: statusText 
    }, { quoted: mek });

    // 🛡️ Fixed Number Reply Handler
    conn.ev.on('messages.upsert', async (msgUpdate) => {
        const msg = msgUpdate.messages[0];
        if (!msg.message) return;
        
        const bodyText = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const context = msg.message.extendedTextMessage?.contextInfo
        if (context && context.stanzaId === sentMsg.key.id) {
            
            if (bodyText === '1') {
                await conn.sendMessage(from, { react: { text: "📜", key: msg.key }});
                const cmdName = "menu"; 
                const selectedCmd = commands.find((c) => c.pattern === cmdName || (c.alias && c.alias.includes(cmdName)));
                if (selectedCmd) return selectedCmd.function(conn, msg, msg, { from, prefix, pushname, reply, q: '', isGroup: m.isGroup });
            } 
            else if (bodyText === '2') {
                await conn.sendMessage(from, { react: { text: "📡", key: msg.key }});
                const cmdName = "ping";
                const selectedCmd = commands.find((c) => c.pattern === cmdName || (c.alias && c.alias.includes(cmdName)));
                if (selectedCmd) return selectedCmd.function(conn, msg, msg, { from, prefix, pushname, reply, q: '', isGroup: m.isGroup });
            } 
            else if (bodyText === '3') {
                await conn.sendMessage(from, { react: { text: "📞", key: msg.key }});
                const cmdName = "owner";
                const selectedCmd = commands.find((c) => c.pattern === cmdName || (c.alias && c.alias.includes(cmdName)));
                if (selectedCmd) return selectedCmd.function(conn, msg, msg, { from, prefix, pushname, reply, q: '', isGroup: m.isGroup });
            }
        }
    });

} catch (e) {
    console.log(e);
}
})

cmd({
    pattern: "owner",
    react: "🥷",
    desc: "Get owner numbers",
    category: "main",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {

    try {

        // Owners List
        const owners = [
            { name: "MAIN-OWNER", number: "+94757166965" },
            { name: "API-HELPER", number: "+94710167783" },
            { name: "CO-OWNER", number: "+94758260318" },
            { name: "BUG-FIXED", number: "+94743198342" }
        ];

        let contacts = [];

        for (let owner of owners) {

            const vcard =
                'BEGIN:VCARD\n' +
                'VERSION:3.0\n' +
                `FN:${owner.name}\n` +
                `TEL;type=CELL;type=VOICE;waid=${owner.number.replace('+', '')}:${owner.number}\n` +
                'END:VCARD';

            contacts.push({ vcard });
        }

        await conn.sendMessage(from, {
            contacts: {
                displayName: "Owner Contacts",
                contacts: contacts
            }
        });

    } catch (error) {
        console.error(error);
        reply(`An error occurred: ${error.message}`);
    }

});
