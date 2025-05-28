const express = require('express');
const { AppDataSource } = require('./src/config/data-source');
const app = express();
const authRoutes = require('./src/modules/auth/auth.routes');
const categoryRoutes = require('./src/modules/category/category.routes');
const transactionRoutes = require('./src/modules/transaction/transaction.routes');
const reportRoutes = require('./src/modules/report/report.routes');
const cors = require('cors');
const authMiddleware = require('./src/modules/auth/auth-middleware');

async function main() {
  app.use(express.json());
  app.use(
    cors({
      origin: '*',
    })
  );

  AppDataSource.initialize()
    .then(() => {
      console.log('Conectado ao PostgreSQL com TypeORM');
    })
    .catch((err) => {
      console.error('Erro ao conectar no banco', err);
      return;
    });

  // Rota de Login e cadastro
  app.use('/api/auth', authRoutes);

  // Rota de Categorias
  app.use('/api/categories', authMiddleware, categoryRoutes);

  // Rota de Transações
  app.use('/api/transactions', authMiddleware, transactionRoutes);

  // Rota de Relatórios
  app.use('/api/report', reportRoutes);
  app.listen(3001, () => {
    console.log('Servidor rodando na porta 3001');
  });
}

main().catch((err) =>
  console.error('Erro ao conectar ao banco de dados:', err)
);
