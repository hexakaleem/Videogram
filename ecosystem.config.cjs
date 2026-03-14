module.exports = {
    apps: [
        {
            name: 'videogram-api',
            script: './backend/src/index.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env_file: './.env',
            env: {
                NODE_ENV: 'production'
            }
        },
        {
            name: 'videogram-frontend',
            script: 'serve',
            env: {
                PM2_SERVE_PATH: './frontend/dist',
                PM2_SERVE_PORT: 8080,
                PM2_SERVE_SPA: 'true',
                PM2_SERVE_HOMEPAGE: '/index.html'
            }
        }
    ]
};
