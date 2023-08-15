exports.up = knex => knex.schema.createTable('users', table => {
  table.uuid('id').default(knex.fn.uuid());
  table.text('name').notNullable();
  table.text('email').notNullable();
  table.text('password').notNullable();
  table.uuid('profile_id').references('id').inTable('profiles');
  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('updated_at').default(knex.fn.now());

  table.unique('id');
  table.unique('email');
});

exports.down = knex => knex.schema.dropTable('users');
