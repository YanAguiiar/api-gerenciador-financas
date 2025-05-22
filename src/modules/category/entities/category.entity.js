const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Category',
  tableName: 'categories',
  columns: {
    id: { primary: true, type: 'int', generated: true },
    name: { type: 'varchar' },
  },
  relations: {
    user: {
      type: 'many-to-one',
      target: 'User',
      joinColumn: true,
      nullable: false,
    },
    transactions: {
      type: 'one-to-many',
      target: 'Transaction',
      inverseSide: 'category',
    },
  },
});
