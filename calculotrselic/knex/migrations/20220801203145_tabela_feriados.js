
exports.up = function(knex) {
    return knex.schema
    .createTable('feriados', function (table) {
        table.increments('co_feriado').primary();
        table.date('dt_feriado').notNullable();
        table.string('no_feriado').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema
      .dropTable("feriados");
};
