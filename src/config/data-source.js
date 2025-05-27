const { DataSource } = require('typeorm');
const path = require('path');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  migrationsRun: true,
  logging: false,
  entities: [path.join(__dirname, '../**/entities/*.js')],
  migrations: [path.join(__dirname, '../src/migrations/*.js')],
});

module.exports = { AppDataSource };
