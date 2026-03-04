# 🤖 WhatsApp AI Bot

A WhatsApp bot powered by **Groq AI (LLaMA 3)** that responds to messages naturally, like a real human.

---

## 📁 Project Structure

```
whatsapp-bot/
├── bot.js              # Main bot (WhatsApp client)
├── ai.js               # Groq AI integration + memory
├── config.js           # Personality prompt & settings ← EDIT THIS
├── .env                # API keys & settings
├── ecosystem.config.js # PM2 config (Option A: no Docker)
├── Dockerfile          # Docker image (Option B: Docker)
├── docker-compose.yml  # Docker Compose
└── package.json
```

---

## ⚙️ Setup

### 1. Edit your personality
Open `config.js` and update `SYSTEM_PROMPT` to match your speaking style, language, and personality.

### 2. Edit `.env`
```env
GROQ_API_KEY=your_key_here
REPLY_IN_GROUPS=false        # Set to true to also reply in group chats
MY_NUMBER=                   # Optional: your number to filter
```

---

## 🚀 Deployment Options

### Option A — PM2 (Simple VPS)

```bash
# Install Node.js 20+ and PM2
npm install
npm install -g pm2

# Start the bot
pm2 start ecosystem.config.js

# Make it auto-start on server reboot
pm2 startup
pm2 save

# View logs
pm2 logs whatsapp-bot
```

### Option B — Docker (Recommended)

```bash
# Build and start
docker-compose up -d

# First run: view logs to get the QR code
docker-compose logs -f

# View logs later
docker-compose logs -f whatsapp-bot
```

---

## 📱 First-Time QR Code Scan

1. Start the bot (either method above)
2. A QR code appears in the terminal/logs
3. Open WhatsApp on your phone
4. Go to **Settings → Linked Devices → Link a Device**
5. Scan the QR code
6. ✅ Done! Session is saved — no need to scan again after restarts.

---

## 🛠️ Customization

| Setting | File | Description |
|---|---|---|
| Personality prompt | `config.js` | How the AI talks |
| AI model | `config.js` | Change Groq model |
| Typing delay | `config.js` | Realistic delay before reply |
| Conversation memory | `config.js` | How many messages to remember |
| Group chats | `.env` | Enable/disable group replies |

---

## 📋 Requirements

- Node.js 20+
- 1GB+ RAM (Chromium runs headless)
- Ubuntu 20.04+ recommended for server

---

## ⚠️ Important Notes

- The bot runs **on your real WhatsApp account** — it will auto-reply to everyone
- Keep your `.env` file private — never commit it to Git
- WhatsApp may occasionally require re-authentication (delete `/session` folder and restart to re-scan QR)
