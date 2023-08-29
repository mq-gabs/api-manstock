exports.up = knex => 
knex.schema.createTable('payment_types', table => {
  table.uuid('id').default(knex.fn.uuid());
  table.string('name');
  table.timestamp('created_at').default(knex.fn.now());
  table.timestamp('updated_at').default(knex.fn.now());

  table.unique('id');
})
.alterTable('purchases', table => {
  table.uuid('payment_type_id').references('id').inTable('payment_types');
})
;

exports.down = knex => 
knex.schema.dropTable('payment_types')
.alterTable('purchases', table => table.dropColumn('payment_type_id'));