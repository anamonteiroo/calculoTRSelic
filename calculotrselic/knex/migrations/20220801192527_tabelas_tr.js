
exports.up = function(knex) {
    return knex.schema
    .createTable('tr', function (table) {
        table.increments('co_tr').primary();
        table.date('dt_efetiva').notNullable();
        table.date('dt_fim').notNullable();
        table.decimal('vr_taxa').notNullable();
    }).createTable('tr_prorata', function (table) {
        table.increments('co_tr_prorata').primary();
        table.date('dt_efetiva').notNullable();
        table.date('dt_fim').notNullable();
        table.decimal('vr_taxa').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema
      .dropTable("tr")
      .dropTable("tr_prorata");
};