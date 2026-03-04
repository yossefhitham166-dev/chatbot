/**
 * bot.js — Main WhatsApp Bot Entry Point
 * 
 * Run: node bot.js
 * First run: Scan the QR code with WhatsApp → Linked Devices
 */

require("dotenv").config();
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { generateReply } = require("./ai");
const config = require("./config");

const REPLY_IN_GROUPS = process.env.REPLY_IN_GROUPS === "true";

// ─────────────────────────────────────────────
// Initialize WhatsApp Client
// LocalAuth saves session to disk so you only scan QR once
// ─────────────────────────────────────────────
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: "./session" }),
    puppeteer: {
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--disable-gpu",
            "--disable-extensions",
            "--disable-software-rasterizer",
        ],
    },
});

// ─────────────────────────────────────────────
// Events
// ─────────────────────────────────────────────

client.on("qr", (qr) => {
    console.log("\n📱 Scan this QR code with WhatsApp (Linked Devices):\n");
    qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
    console.log("✅ Authenticated successfully");
});

client.on("auth_failure", (msg) => {
    console.error("❌ Authentication failed:", msg);
    process.exit(1);
});

client.on("ready", () => {
    console.log("🤖 Bot is ready and listening for messages!");
    console.log(`   Group reply: ${REPLY_IN_GROUPS ? "ON" : "OFF"}`);
});

client.on("disconnected", (reason) => {
    console.warn("⚠️  Bot disconnected:", reason);
    console.log("🔄 Attempting to reconnect...");
    client.initialize();
});

// ─────────────────────────────────────────────
// Message Handler
// ─────────────────────────────────────────────
client.on("message", async (message) => {
    try {
        // Ignore status updates / broadcasts
        if (message.isStatus) return;

        const chat = await message.getChat();

        // Ignore empty or media-only messages
        const userText = message.body?.trim();
        if (!userText) return;

        // --- NEW LOGIC: ONLY Group Chats & ONLY Trigger Words ---

        // Ignore all private messages completely
        if (!chat.isGroup) return;

        // Group chats: Only reply if the message contains specific trigger words
        const groupTriggers = ["search tool", "ep", "intreseted", "interested", "hello", "hi", "يا كونس", "كونس", "cons", "conss"];
        const textLower = userText.toLowerCase();
        const hasTrigger = groupTriggers.some(trigger => textLower.includes(trigger));

        if (!hasTrigger) return;
        // ---------------------------------------------------------

        // Get sender ID for conversation memory
        const contactId = message.from;

        console.log(`💬 [${new Date().toLocaleTimeString()}] From ${contactId}: ${userText}`);

        // Simulate realistic typing delay
        const delay =
            config.MIN_TYPING_DELAY +
            Math.random() * (config.MAX_TYPING_DELAY - config.MIN_TYPING_DELAY);

        // Show "typing..." indicator
        await chat.sendStateTyping();

        // Wait before replying (feels natural)
        await sleep(delay);

        // ── Keyword Triggers ──────────────────────────────────────
        // Add any word → reply pairs here. No AI needed for these.
        const keywordTriggers = {
            "كونس": "اييييييه",
            "ep": "hiii",
            "interested": "Hi",
            "hello": "hi dear ",
            "hi": "hiiiii ",
            "cons": "اييييييه",
            "conss": "اييييييه",
        };

        const textLowerMatch = userText.toLowerCase();
        const matched = Object.entries(keywordTriggers).find(([kw]) =>
            textLowerMatch.includes(kw.toLowerCase())
        );

        if (matched) {
            await chat.clearState();
            await message.reply(matched[1]);
            console.log(`🎯 Keyword "${matched[0]}" → "${matched[1]}"`);
            return;
        }

        // AI is disabled as requested — the bot will exactly and ONLY respond based on the keywords above.
        await chat.clearState();
        return;
    } catch (err) {
        console.error("❌ Error handling message:", err.message);
    }
});

// ─────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────
console.log("🚀 Starting WhatsApp AI Bot...");
client.initialize();
