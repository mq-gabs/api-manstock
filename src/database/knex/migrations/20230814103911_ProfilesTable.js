exports.up = knex => 
knex.schema.createTable('profiles', table => {
  table.uuid('id').defaultTo(knex.fn.uuid());
  table.string('name');
  table.string('description');
  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('updated_at').default(knex.fn.now());

  table.unique('id');
})
.alterTable('users', table => {
  table.uuid('profile_id').references('id').inTable('profiles');
});

exports.down = knex => 
knex.schema.dropTable('profiles')
.alterTable('users', table => table.dropColumn('profile_id'));