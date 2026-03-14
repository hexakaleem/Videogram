module.exports = {
    apps: [
        {
            name: 'videogram-api',
            script: './backend/src/index.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            error_file: './logs/api-error.log',
            out_file: './logs/api-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true,
            env_file: './.env',
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};
