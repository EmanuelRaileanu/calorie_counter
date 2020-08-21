import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('email').unique();
        table.string('password');
        table.string('name');
        table.date('dateOfBirth');
        table.string('bearerToken');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
    });
};


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
};

