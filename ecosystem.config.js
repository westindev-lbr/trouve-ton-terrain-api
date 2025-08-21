module.exports = {
  apps: [
    {
      name: 'trouve-ton-terrain-api', // nom qui apparaîtra dans pm2 list
      script: 'dist/main.js', // fichier compilé par NestJS
      cwd: '/var/www/prod/ttt-api/current',
      instances: 'max', // ou 1 si tu veux un seul process
      exec_mode: 'cluster', // cluster = load balancing multi-cpu
      interpreter: 'node',

      // Redémarrages et stabilité
      autorestart: true,
      watch: false,
      max_memory_restart: '512M', // redémarre si fuite mémoire
      min_uptime: '10s', // considère l'app "up" après 10s
      max_restarts: 10, // évite les boucles infinies
      exp_backoff_restart_delay: 100, // backoff exponentiel (ms)
      kill_timeout: 5000, // laisse du temps au shutdown gracieux

      // Arguments & options Node
      node_args: ['--enable-source-maps'],
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        // Variables d'env "dev" (exemples)
        // DATABASE_URL: "postgres://user:pass@localhost:5432/ttt_dev",
        // REDIS_URL: "redis://localhost:6379",
        // CORS_ORIGIN: "http://localhost:4200",

        // Watch en DEV uniquement
        PM2_HOME: process.env.PM2_HOME || undefined,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        // DATABASE_URL: "postgres://user:pass@db:5432/ttt",
        // REDIS_URL: "redis://redis:6379",
        // CORS_ORIGIN: "https://trouve-ton-terrain.fr",
        // Exemple: activer trust proxy / autres flags prod via variables
      },

      // Logs (un fichier par instance en cluster; merge_logs regroupe tout dans un seul fichier)
      merge_logs: true,
      time: true, // timestamps dans les logs
      out_file: '/var/log/pm2/trouve-ton-terrain-api/out.log',
      error_file: '/var/log/pm2/trouve-ton-terrain-api/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Santé (si ton app expose /health, tu peux brancher un probe externe plutôt que PM2)
      // wait_ready: true,               // à utiliser seulement si ton app envoie process.send('ready')
      // listen_timeout: 8000,
      // shutdown_with_message: true,    // si tu gères SIGINT/SIGTERM pour un shutdown propre
    },
  ],
};
