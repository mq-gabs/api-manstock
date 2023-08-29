const path = require('path');

module.exports = {
  dev1: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'src', 'database', 'database.db'),
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'knex', 'migrations'),
    },
    useNullAsDefault: true,
  },
  dev2: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'knex', 'migrations'),
    },
    useNullAsDefault: true,
  }
};