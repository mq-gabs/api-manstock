exports.up = knex => knex.schema.createTable('products', table => {
  table.uuid('id').default(knex.fn.uuid());
  table.string('name').notNullable();
  table.float('price', { precision: 2 }).notNullable();
  table.string('code').notNullable();
  table.uuid('owner').references('id').inTable('users');
  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('updated_at').default(knex.fn.now());

  table.unique('id');
});

exports.down = knex => knex.schema.dropTable('products');