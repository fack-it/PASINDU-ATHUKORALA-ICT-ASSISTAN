const { cmd } = require('../command');
const config = require('../config');

const menuImg = "https://files.catbox.moe/025xe2.jpg";

// PDF Bank
const pdfBank = {
    "1": { key: "lesson01", title: "Introduction to ICT", url: "https://files.catbox.moe/lesson01.pdf" },
    "2": { key: "eoc", title: "Evolution Of ICT", url: "https://files.catbox.moe/eoc.pdf" },
    "3": { key: "nettheory", title: "Networking Theory", url: "https://files.catbox.moe/nettheory.pdf" },
    "4": { key: "logicgate", title: "Logic Gates", url: "https://files.catbox.moe/logicgate.pdf" },
    "5": { key: "ospt1", title: "Operating System - Part 01", url: "https://files.catbox.moe/ospt1.pdf" },
    "6": { key: "ospt2", title: "Operating System - Part 02", url: "https://files.catbox.moe/ospt2.pdf" },
    "7": { key: "htmltute", title: "HTML Tute", url: "https://files.catbox.moe/htmltute.pdf" },
    "8": { key: "htmlnote", title: "HTML Note", url: "https://files.catbox.moe/htmlnote.pdf" },
    "9": { key: "csstute", title: "CSS Tute", url: "https://files.catbox.moe/csstute.pdf" },
    "10": { key: "cssnote", title: "CSS Note", url: "https://files.catbox.moe/cssnote.pdf" },
    "11": { key: "booleanlaws", title: "Boolean laws and K-maps", url: "https://files.catbox.moe/booleanlaws.pdf" },
    "12": { key: "pysem01", title: "Python Seminar - Day 01", url: "https://files.catbox.moe/pysem01.pdf" },
    "13": { key: "pysem02", title: "Python Seminar - Day 02", url: "https://files.catbox.moe/pysem02.pdf" },
    "14": { key: "pysem03", title: "Python Seminar - Day 03", url: "https://files.catbox.moe/pysem03.pdf" },
    "15": { key: "pysem04", title: "Python Seminar - Day 04", url: "https://files.catbox.moe/pysem04.pdf" },
    "16": { key: "ossem26", title: "OS Seminar - 2026 A/L", url: "https://files.catbox.moe/ossem26.pdf" },
    "17": { key: "pysem05", title: "Python Seminar - Day 05", url: "https://files.catbox.moe/pysem05.pdf" },
    "18": { key: "pysem06", title: "Python Seminar - Day 06 (Last Day)", url: "https://files.catbox.moe/pysem06.pdf" }
};

// Active menu track කරන්න
const activePDFMenu = new Map();

cmd({
    pattern: "notebank",
    alias: ["pdf", "notes", "study"],
    desc: "Show all available PDF notes",
    category: "ict",
    react: "📂",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        let list = `*Pasindu Athukorala ICT* · *Study Assistant*\n─────────────────────────\n\n`;
        list += `📂 *PDF BANK & STUDY NOTES*\n─────────────────────────\n\n`;
        list += `පහත දැක්වෙන Number එක reply කරන්න:\n`;
        list += `_(Reply with the number to download PDF directly)_\n\n`;

        for (const num in pdfBank) {
            list += `${num} │❯◦ *${pdfBank[num].title}*\n`;
        }

        list += `\n─────────────────────────\n`;
        list += `_Example: Reply 1 to get "Introduction to ICT"` + "`\n\n`";
        list += `*Pasindu Athukorala ICT Team* 📚`;

        const sent = await conn.sendMessage(from, {
            image: { url: menuImg },
            caption: list
        }, { quoted: mek });

        // මේ message එකට reply බලාගෙන ඉන්න
        activePDFMenu.set(sent.key.id, { from });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}`);
    }
});

// PDF Send Function
async function sendPDF(conn, from, pdf, quoted) {
    await conn.sendMessage(from, { react: { text: "📤", key: quoted.key }});
    await conn.sendPresenceUpdate('composing', from);

    await conn.sendMessage(from, {
        document: { url: pdf.url },
        mimetype: 'application/pdf',
        fileName: `${pdf.title}.pdf`,
        caption: `*📚 ${pdf.title}*\n\n*Pasindu Athukorala ICT Team*`
    }, { quoted });

    await conn.sendMessage(from, { react: { text: "✅", key: quoted.key }});
}

// Global Reply Listener - 1යි
conn.ev.on('messages.upsert', async (msgUpdate) => {
    const msg = msgUpdate.messages[0];
    if (!msg.message) return;

    const bodyText = msg.message.conversation || msg.message.extendedTextMessage?.text;
    const context = msg.message.extendedTextMessage?.contextInfo;

    if (!context ||!activePDFMenu.has(context.stanzaId)) return;

    const menuData = activePDFMenu.get(context.stanzaId);
    const selected = bodyText?.trim();

    const pdf = pdfBank[selected];

    if (!pdf) {
        await conn.sendMessage(menuData.from, {
            text: "❌ Invalid number. Please reply 1-18"
        }, { quoted: msg });
        return;
    }

    await sendPDF(conn, menuData.from, pdf, msg);
    activePDFMenu.delete(context.stanzaId); // use කරාට පස්සෙ අයින් කරන්න
});

// Backword compatibility -!note lesson01
cmd({
    pattern: "note",
    desc: "Download ICT PDF by key",
    category: "ict",
    react: "📄",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply(`❌ Usage:!note lesson01\n\nType *!notebank* to see all PDFs`);

    const pdf = Object.values(pdfBank).find(p => p.key === q.toLowerCase());
    if (!pdf) return reply(`❌ PDF Not Found. Type *!notebank*`);

    await sendPDF(conn, from, pdf, mek);
});
