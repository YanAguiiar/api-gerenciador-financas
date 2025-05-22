const { DataSource } = require('typeorm');
const path = require('path');

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'finance_app',
  synchronize: true,
  migrationsRun: true,
  logging: false,
  entities: [path.join(__dirname, '../**/entities/*.js')],
  migrations: [path.join(__dirname, '../src/migrations/*.js')],
});

module.exports = { AppDataSource };
