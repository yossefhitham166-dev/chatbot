// ecosystem.config.js — PM2 Configuration
// Use this instead of Docker for a simpler deployment
// 
// Install PM2:  npm install -g pm2
// Start bot:   pm2 start ecosystem.config.js
// Auto-start:  pm2 startup && pm2 save

module.exports = {
    apps: [
        {
            name: "whatsapp-bot",
            script: "bot.js",
            watch: false,
            autorestart: true,
            max_restarts: 10,
            restart_delay: 5000,
            env: {
                NODE_ENV: "production",
            },
            // Log settings
            out_file: "./logs/bot-out.log",
            error_file: "./logs/bot-error.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            merge_logs: true,
        },
    ],
};
