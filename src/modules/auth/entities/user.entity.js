const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    name: { type: 'varchar' },
    email: { type: 'varchar', unique: true },
    password: { type: 'varchar' },
  },
  relations: {
    transactions: {
      type: 'one-to-many',
      target: 'Transaction',
      inverseSide: 'user',
    },
    categories: {
      type: 'one-to-many',
      target: 'Category',
      inverseSide: 'user',
    },
  },
});
