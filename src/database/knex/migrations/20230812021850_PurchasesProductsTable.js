exports.up = knex => knex.schema.createTable('purchases_products', table => {
  table.uuid('purchase_id').references('id').inTable('purchases');
  table.uuid('product_id').references('id').inTable('products');
  table.integer('quantity');
});

exports.down = knex => knex.schema.dropTable('purchases_products');