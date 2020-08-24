import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('email').unique();
        table.string('password');
        table.string('name');
        table.date('dateOfBirth');
        table.string('bearerToken');
        table.string('passwordResetToken');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('users_foods', table => {
        table.integer('userId').unsigned().references('id').inTable('users');
        table.integer('foodId').unsigned().references('id').inTable('foods');
        table.integer('grams');
    });
};


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users_foods');
    await knex.schema.dropTable('users');
};

