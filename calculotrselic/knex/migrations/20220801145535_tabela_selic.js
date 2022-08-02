
exports.up = function(knex) {
    return knex.schema
    .createTable('selic', function (table) {
        table.increments('co_selic').primary();
        table.date('dt_efetiva').notNullable();
        table.decimal('vr_taxa').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema
      .dropTable("selic");
};
