require('dotenv').config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USER || "admin",
    password: process.env.POSTGRES_PASSWORD || "skyconet",
    database: process.env.POSTGRES_DB || "blogdb",
    host: process.env.POSTGRES_HOST || "localhost",
    dialect: 'postgres',
    port: process.env.POSTGRES_PORT || 5432
  },
  test: {
    username: process.env.POSTGRES_USER || "admin",
    password: process.env.POSTGRES_PASSWORD || "skyconet",
    database: process.env.POSTGRES_DB || "blogdb",
    host: process.env.POSTGRES_HOST || "localhost",
    dialect: 'postgres',
    port: process.env.POSTGRES_PORT || 5432
  },
  production: {
    username: process.env.POSTGRES_USER || "admin",
    password: process.env.POSTGRES_PASSWORD || "skyconet",
    database: process.env.POSTGRES_DB || "blogdb",
    host: process.env.POSTGRES_HOST || "localhost",
    dialect: 'postgres',
    port: process.env.POSTGRES_PORT || 5432
  }
};