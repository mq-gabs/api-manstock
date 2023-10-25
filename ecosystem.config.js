module.exports = {
  apps: [
    {
      name: "api-manstock",
      script: "./src/index.js",
      instances: "max",
      env: {
        NODE_ENV: "dev1",
      },
      env_production: {
        NODE_ENV: "dev1",
      },
    },
  ],
};
