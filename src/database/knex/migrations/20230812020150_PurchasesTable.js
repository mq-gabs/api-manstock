exports.up = knex => knex.schema.createTable('purchases', table => {
  table.uuid('id').default(knex.fn.uuid());
  table.float('total', { precision: 2 }).notNullable();
  table.float('payment', { precision: 2 }).notNullable();
  table.float('change', { precision: 2});
  table.uuid('owner').references('id').inTable('users');
  table.timestamp('created_at').default(knex.fn.now());

  table.unique('id');
});

exports.down = knex => knex.schema.dropTable('purchases');