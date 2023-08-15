exports.up = knex => knex.schema.createTable('payment_types', table => {
  table.uuid('id').default(knex.fn.uuid());
  table.text('name');
  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('updated_at').default(knex.fn.now());

  table.unique('id');
});

exports.down = knex => knex.schema.dropTable('payment_types');