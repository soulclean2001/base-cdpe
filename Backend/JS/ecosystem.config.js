// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'tuyendung',
      script: 'node dist/index.js',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
