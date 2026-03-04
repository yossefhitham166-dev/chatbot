# ─────────────────────────────────────────
# Dockerfile for WhatsApp AI Bot
# ─────────────────────────────────────────

FROM node:20-slim

# Install Chromium dependencies (required by whatsapp-web.js / Puppeteer)
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libxshmfence1 \
    wget \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Tell Puppeteer to use installed Chromium instead of downloading its own
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./
RUN npm install --production

# Copy source files
COPY . .

# Create session directory
RUN mkdir -p session

# Expose nothing (WhatsApp is client-side only)
CMD ["node", "bot.js"]
