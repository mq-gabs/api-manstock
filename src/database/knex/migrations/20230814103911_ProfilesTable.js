exports.up = knex => knex.schema.createTable('profiles', table => {
  table.uuid('id').defaultTo(knex.fn.uuid());
  table.text('name');
  table.text('description');
  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('updated_at').default(knex.fn.now());

  table.unique('id');
})

exports.down = knex => knex.schema.dropTable('profiles');