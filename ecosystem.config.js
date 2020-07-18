module.exports = {
    apps : [{
      name: "language power",
      script: "./app.js",
      instances: "max",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      }
    }]
  }