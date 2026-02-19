module.exports = {
  apps: [
    {
      name: "the-blockchain-project",
      script: "./dist/index.js",
      interpreter: "bun",
      env: {
        DATABASE_URL: "./data/db.sqlite",
        PORT: 3000,
      },
    },
  ],
};
