const { cmd } = require('../lib/command');
const config = require('../settings');

// Premium banner image for the Note Bank
const menuImg = "https://files.catbox.moe/33zgtm.png";

// Highly structured PDF data repository with the Prefix-Based Numbering System
const pdfBank = {
    // Category 1: Foundations of ICT & Core Theory (Prefix: T)
    "T1": { key: "lesson01", title: "Introduction to ICT", size: "1.8 MB", category: "Core Theory", url: "https://drive.google.com/file/d/11pQIQnXzP2hK6pc-PweMZBPLfgBxmzyq/view?usp=drivesdk" },
    "T2": { key: "eoc", title: "Evolution Of ICT", size: "2.4 MB", category: "Core Theory", url: "https://drive.google.com/file/d/1gVLY8DP031dFCwyQ8BQo75s9UHgED_nz/view?usp=drivesdk" },
    "T3": { key: "nettheory", title: "Networking Theory", size: "3.1 MB", category: "Core Theory", url: "https://files.catbox.moe/nettheory.pdf" },
    "T4": { key: "logicgate", title: "Logic Gates", size: "1.5 MB", category: "Core Theory", url: "https://files.catbox.moe/logicgate.pdf" },
    "T5": { key: "ospt1", title: "Operating System - Part 01", size: "2.0 MB", category: "Core Theory", url: "https://files.catbox.moe/ospt1.pdf" },
    "T6": { key: "ospt2", title: "Operating System - Part 02", size: "2.2 MB", category: "Core Theory", url: "https://files.catbox.moe/ospt2.pdf" },
    "T7": { key: "booleanlaws", title: "Boolean laws and K-maps", size: "1.7 MB", category: "Core Theory", url: "https://files.catbox.moe/booleanlaws.pdf" },

    // Category 2: Web Development (Prefix: W)
    "W1": { key: "htmltute", title: "HTML Tute", size: "1.2 MB", category: "Web Development", url: "https://files.catbox.moe/htmltute.pdf" },
    "W2": { key: "htmlnote", title: "HTML Note", size: "2.8 MB", category: "Web Development", url: "https://files.catbox.moe/htmlnote.pdf" },
    "W3": { key: "csstute", title: "CSS Tute", size: "1.4 MB", category: "Web Development", url: "https://files.catbox.moe/csstute.pdf" },
    "W4": { key: "cssnote", title: "CSS Note", size: "3.0 MB", category: "Web Development", url: "https://files.catbox.moe/cssnote.pdf" },

    // Category 3: Programming & Python Seminars (Prefix: P)
    "P1": { key: "pysem01", title: "Python Seminar - Day 01", size: "4.1 MB", category: "Python Programming", url: "https://files.catbox.moe/pysem01.pdf" },
    "P2": { key: "pysem02", title: "Python Seminar - Day 02", size: "3.9 MB", category: "Python Programming", url: "https://files.catbox.moe/pysem02.pdf" },
    "P3": { key: "pysem03", title: "Python Seminar - Day 03", size: "4.5 MB", category: "Python Programming", url: "https://files.catbox.moe/pysem03.pdf" },
    "P4": { key: "pysem04", title: "Python Seminar - Day 04", size: "4.2 MB", category: "Python Programming", url: "https://files.catbox.moe/pysem04.pdf" },
    "P5": { key: "pysem05", title: "Python Seminar - Day 05", size: "4.8 MB", category: "Python Programming", url: "https://files.catbox.moe/pysem05.pdf" },
    "P6": { key: "pysem06", title: "Python Seminar - Day 06 (Last)", size: "5.2 MB", category: "Python Programming", url: "https://files.catbox.moe/pysem06.pdf" },

    // Category 4: Target Seminars (Prefix: S)
    "S1": { key: "ossem26", title: "OS Seminar - 2026 A/L", size: "3.5 MB", category: "Seminars & Targets", url: "https://files.catbox.moe/ossem26.pdf" }
};

// Session tracking to manage active menus per user
const userSessions = new Map();

// Download statistics tracking
const downloadStats = {};
for (const code in pdfBank) {
    downloadStats[pdfBank[code].key] = 0;
}


// Helper function to safely send documents with loading states
async function sendPDF(conn, from, code, pdf, quoted) {
    try {
        await conn.sendMessage(from, { react: { text: "📤", key: quoted.key }});
        await conn.sendPresenceUpdate('composing', from);

        // Send the document directly
        await conn.sendMessage(from, {
            document: { url: pdf.url },
            mimetype: 'application/pdf',
            fileName: `${pdf.title}.pdf`,
            caption: `*🎓 STUDY DOCUMENT DELIVERED*\n\n` +
                     `*📚 Title:* ${pdf.title}\n` +
                     `*📂 Category:* ${pdf.category}\n` +
                     `*💾 Size:* ${pdf.size}\n` +
                     `*🔑 Code:* \`${code}\`\n\n` +
                     `_Pasindu Athukorala ICT Support_ ✨`
        }, { quoted });

        // Update stats
        downloadStats[pdf.key] = (downloadStats[pdf.key] || 0) + 1;

        await conn.sendMessage(from, { react: { text: "✅", key: quoted.key }});
    } catch (error) {
        console.error("PDF Send Error:", error);
        await conn.sendMessage(from, { text: `❌ PDF එක යැවීමේදී දෝෂයක් සිදු විය: ${error.message}` }, { quoted });
    }
}

// Generate the beautifully styled categorized menu using the Prefixes
function generateCategorizedMenu() {
    let text = `*👨‍🏫 Pasindu Athukorala ICT · Study Companion*\n` +
               `*💻 HIGH-SPEED STUDY RESOURCE BANK*\n` +
               `───────────────────────────────\n\n`;

    // Define categories in custom order for display
    const categories = [
        { name: "Core Theory", icon: "📘", prefix: "T" },
        { name: "Web Development", icon: "🌐", prefix: "W" },
        { name: "Python Programming", icon: "🐍", prefix: "P" },
        { name: "Seminars & Targets", icon: "🎓", prefix: "S" }
    ];

    categories.forEach(cat => {
        text += `*${cat.icon} ${cat.name.toUpperCase()} (Prefix: ${cat.prefix})*\n`;
        text += `───────────────────────────────\n`;
        
        let hasItems = false;
        for (const code in pdfBank) {
            const item = pdfBank[code];
            if (item.category === cat.name) {
                text += `*${code}* 💠 ${item.title}\n`;
                text += `   ↳ _Size: ${item.size} | Key: \`${item.key}\`_\n\n`;
                hasItems = true;
            }
        }
        if (!hasItems) text += `_No notes available in this category yet._\n\n`;
    });

    text += `───────────────────────────────\n` +
            `📥 *පහත ක්‍රම මගින් PDF ලබා ගත හැක:*\n` +
            `1️⃣ ඔබට අවශ්‍ය Note එකෙහි *කේතය (Code)* සෘජුවම Chat එකට එවන්න. (උදා: *T1* හෝ *W2*)\n` +
            `2️⃣ *note [Code/Key]* ලෙස එවන්න. (උදා: *note T4*)\n` +
            `3️⃣ සෙවීමට: *notebank search [නම]*\n\n` +
            `_Pasindu Athukorala ICT Support Team 📚_`;
    return text;
}


// Handler to trigger the main menu response
async function executeMainMenu(conn, from, mek, sender) {
    const menuText = generateCategorizedMenu();
    const sentMenu = await conn.sendMessage(from, {
        image: { url: menuImg },
        caption: menuText
    }, { quoted: mek });

    // Save session bounded safely to user and message stanzaId
    userSessions.set(sender, {
        stanzaId: sentMenu.key.id,
        timestamp: Date.now()
    });
}

// Handler to trigger the search logic
async function executeSearch(conn, from, query, mek, sender) {
    const cleanedQuery = query.toLowerCase();
    const results = Object.entries(pdfBank).filter(([code, note]) => 
        note.title.toLowerCase().includes(cleanedQuery) || 
        note.key.toLowerCase().includes(cleanedQuery) ||
        code.toLowerCase() === cleanedQuery ||
        note.category.toLowerCase().includes(cleanedQuery)
    );

    if (results.length === 0) {
        return conn.sendMessage(from, { text: `🔍 *"${query}"* සඳහා කිසිදු Note එකක් සොයාගත නොහැකි විය. වෙනත් වචනයක් උත්සාහ කරන්න.` }, { quoted: mek });
    }

    let searchResultText = `*🔍 Search Results for "${query}"*\n`;
    searchResultText += `───────────────────────────────\n\n`;
    results.forEach(([code, note]) => {
        searchResultText += `*${code}* 💠 *${note.title}*\n`;
        searchResultText += `   ↳ _Category: ${note.category} | Key: \`${note.key}\`_\n\n`;
    });
    searchResultText += `───────────────────────────────\n` +
                        `💡 ඔබට අවශ්‍ය PDF එක ලබා ගැනීමට අදාළ Code එක සමඟින් මෙම Message එකට Reply කරන්න.`;
    
    const sentSearch = await conn.sendMessage(from, { text: searchResultText }, { quoted: mek });
    userSessions.set(sender, { stanzaId: sentSearch.key.id, timestamp: Date.now() });
}

// Handler to fetch specific note directly
async function executeNoteFetch(conn, from, query, mek) {
    const searchInput = query.trim().toUpperCase();
    
    // Try matching the prefix code directly (e.g., T1, W2)
    let pdf = pdfBank[searchInput];
    let matchedCode = searchInput;

    // If not found, try matching by inner key (e.g. logicgate)
    if (!pdf) {
        const found = Object.entries(pdfBank).find(([code, p]) => p.key.toLowerCase() === query.trim().toLowerCase());
        if (found) {
            matchedCode = found[0];
            pdf = found[1];
        }
    }

    if (pdf) {
        await sendPDF(conn, from, matchedCode, pdf, mek);
    } else {
        // Suggest similar notes if not found
        const suggestions = Object.entries(pdfBank)
            .filter(([code, p]) => code.includes(searchInput) || p.key.toLowerCase().includes(query.trim().toLowerCase()))
            .map(([code, p]) => `• *${code}* ➔ ${p.title}`);

        let errorMsg = `❌ *"${query}"* නමින් Code එකක් හෝ Note එකක් සොයාගත නොහැක.\n\n`;
        if (suggestions.length > 0) {
            errorMsg += `💡 ඔබට අවශ්‍ය මේවායින් එකක්ද?\n${suggestions.join('\n')}\n\n`;
        }
        errorMsg += `👉 සම්පූර්ණ ලැයිස්තුව සහ කේත ලබා ගැනීමට *notebank* (හෝ *.notebank*) ඇතුලත් කරන්න.`;
        
        await conn.sendMessage(from, { text: errorMsg }, { quoted: mek });
    }
}


// Main prefixed command for Notebank
cmd({
    pattern: "notebank",
    alias: ["pdf", "notes", "study", "notelist"],
    desc: "Premium, categorized study note portal with custom codes",
    category: "ict",
    react: "📂",
    nonPrefixed: true, // Support prefixless invocation if supported by the framework core
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        // Handle Search Sub-Command (e.g. .notebank search html)
        if (q && q.trim().toLowerCase().startsWith("search")) {
            const query = q.replace(/^search\s+/i, "").trim();
            if (!query) return reply("❌ කරුණාකර සෙවිය යුතු පදය ඇතුලත් කරන්න. (e.g. .notebank search html)");
            return await executeSearch(conn, from, query, mek, sender);
        }

        // Render full menu
        await executeMainMenu(conn, from, mek, sender);

    } catch (e) {
        console.error("Notebank Error:", e);
        reply(`❌ දෝෂයක් සිදු විය: ${e.message}`);
    }
});

// Prefixed command to fetch notes directly
cmd({
    pattern: "note",
    alias: ["getnote", "download"],
    desc: "Download specific note with code or keyword",
    category: "ict",
    react: "📄",
    nonPrefixed: true, // Support prefixless invocation if supported by core
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    if (!q) {
        return reply(`❌ භාවිතය: \`.note [Code]\` (e.g. \`.note T4\`)\n\nසියලුම Notes සහ Codes බැලීමට \`.notebank\` ඇතුලත් කරන්න.`);
    }
    await executeNoteFetch(conn, from, q, mek);
});


// Safe global text listener to handle code replies & complete prefixless command calls
cmd({
    on: "text"
},
async (conn, mek, m, { from, body, sender }) => {
    try {
        const rawText = body?.trim();
        if (!rawText) return;

        const textVal = rawText.toUpperCase();
        const lowText = rawText.toLowerCase();

        // 1. Direct Code Retrieval (e.g. User just typed "T1" or "W3" without any slash/dot)
        if (pdfBank[textVal]) {
            await sendPDF(conn, from, textVal, pdfBank[textVal], mek);
            return;
        }

        // 2. Fully Prefixless Menu Trigger (e.g. User typed "notebank", "pdf", "notes", "study")
        const prefixlessMenuTriggers = ["notebank", "pdf", "notes", "study", "notelist"];
        if (prefixlessMenuTriggers.includes(lowText)) {
            await executeMainMenu(conn, from, mek, sender);
            return;
        }

        // 3. Fully Prefixless Search Trigger (e.g. User typed "notebank search html")
        if (lowText.startsWith("notebank search ")) {
            const query = rawText.substring(16).trim();
            if (query) {
                await executeSearch(conn, from, query, mek, sender);
                return;
            }
        }

        // 4. Fully Prefixless Note Fetch (e.g. User typed "note T1" or "note htmltute")
        if (lowText.startsWith("note ")) {
            const query = rawText.substring(5).trim();
            if (query) {
                await executeNoteFetch(conn, from, query, mek);
                return;
            }
        }

        // 5. Active Session Interactive Replies (Handles reply to menu)
        if (!userSessions.has(sender)) return;
        const session = userSessions.get(sender);
        
        // Anti-spam timeout: Sessions expire after 5 minutes
        if (Date.now() - session.timestamp > 300000) {
            userSessions.delete(sender);
            return;
        }

        // Verify if this incoming message is actually a reply to our menu prompt
        const context = m.message?.extendedTextMessage?.contextInfo || mek.message?.extendedTextMessage?.contextInfo;
        if (!context || context.stanzaId !== session.stanzaId) return;

        const pdf = pdfBank[textVal];

        if (!pdf) {
            await conn.sendMessage(from, {
                text: "❌ වැරදි කේතයක් (Code). කරුණාකර මෙනුවේ ඇති නිවැරදි කේතයක් (e.g. T1, W2) ඇතුලත් කරන්න."
            }, { quoted: mek });
            return;
        }

        // Deliver Note & purge session safely
        await sendPDF(conn, from, textVal, pdf, mek);
        userSessions.delete(sender);

    } catch (e) {
        console.error("Error in global reply/prefixless handler:", e);
    }
});


// Show download analytics
cmd({
    pattern: "notestats",
    desc: "Show download metrics of the ICT bank",
    category: "ict",
    react: "📊",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    let statText = `*📊 PASINDU ATHUKORALA ICT NOTE STATS*\n`;
    statText += `───────────────────────────────\n\n`;
    
    const sortedStats = Object.entries(downloadStats)
        .sort((a, b) => b[1] - a[1]);

    let totalDownloads = 0;
    sortedStats.forEach(([key, count]) => {
        const note = Object.values(pdfBank).find(p => p.key === key);
        if (note && count > 0) {
            statText += `📈 *${note.title}*  ➔  *${count} downloads*\n`;
            totalDownloads += count;
        }
    });

    if (totalDownloads === 0) {
        statText += `ℹ️ තවමත් මෙම ක්‍රියාකාරී වාරය තුළ කිසිදු බාගත කිරීමක් සිදු වී නොමැත.`;
    } else {
        statText += `\n───────────────────────────────\n`;
        statText += `🏆 Total Note Requests: *${totalDownloads}*\n`;
    }

    reply(statText);
});
