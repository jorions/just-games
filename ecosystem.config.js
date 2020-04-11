module.exports = {
  apps: [
    {
      name: 'app-ui',
      script: './server/index.js',
      env_staging: {
        NODE_ENV: 'staging',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
