exports.up = knex => 
knex.schema.createTable('users', table => {
  table.uuid('id').default(knex.fn.uuid());
  table.string('name').notNullable();
  table.string('email', { constraintName: 'users_email_unique' }).notNullable();
  table.string('password').notNullable();
  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('updated_at').default(knex.fn.now());

  table.unique('id');
  table.unique('email');
});

exports.down = knex => knex.schema.dropTable('users');
