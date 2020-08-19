import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('countries', table => {
        table.increments('id').primary();
        table.string('name');
    });

    await knex.schema.createTable('production_companies', table => {
        table.increments('id').primary();
        table.string('name').unique();
    });

    await knex.schema.createTable('food_categories', table => {
        table.increments('id').primary();
        table.string('category').unique();
    });

    await knex.schema.createTable('files', table => {
        table.increments('id').primary();
        table.string('originalFileName');
        table.string('mimeType');
        table.string('relativePath');
        table.integer('size');
        table.string('fileName');
    });

    await knex.schema.createTable('foods', table => {
        table.increments('id').primary();
        table.string('name');
        table.decimal('caloriesPer100Grams', 5, 1);
        table.decimal('proteinPer100Grams', 3, 1);
        table.decimal('carbohydratesPer100Grams', 3, 1);
        table.decimal('fatPer100Grams', 3, 1);
        table.decimal('fiberPer100Grams', 3, 1);
        table.integer('productionCompanyId').unsigned().references('id').inTable('production_companies');
        table.integer('countryId').unsigned().references('id').inTable('countries');
        table.integer('pictureId').unsigned().references('id').inTable('files');
    });

    await knex.schema.createTable('production_companies_countries', table => {
        table.integer('productionCompanyId').unsigned().references('id').inTable('production_companies');
        table.integer('countryId').unsigned().references('id').inTable('countries');
    });

    await knex.schema.createTable('foods_categories', table => {
        table.integer('foodId').unsigned().references('id').inTable('foods');
        table.integer('categoryId').unsigned().references('id').inTable('food_categories');
    });
};

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('foods_categories');
    await knex.schema.dropTable('production_companies_countries');
    await knex.schema.dropTable('foods');
    await knex.schema.dropTable('files');
    await knex.schema.dropTable('food_categories');
    await knex.schema.dropTable('production_companies');
    await knex.schema.dropTable('countries');
};

