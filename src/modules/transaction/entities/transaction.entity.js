// src/modules/transaction/entities/transaction.entity.js
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Transaction',
  tableName: 'transactions',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    title: { type: 'varchar' },
    value: { type: 'decimal', precision: 10, scale: 2 },
    type: { type: 'enum', enum: ['RECEITA', 'DESPESA'] },
    date: { type: 'date' },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
      nullable: false,
    },
    category: {
      type: 'many-to-one',
      target: 'Category',
      joinColumn: true,
      nullable: false,
    },
  },
});
