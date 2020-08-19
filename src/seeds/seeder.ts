import * as Knex from "knex";
import * as Seed from '../utilities/seederFunctions';
import Data from '../utilities/seederData';

export async function seed(knex: Knex): Promise<void> {
    await Seed.insertCountries(Data.countries);
    await Seed.insertFoodCategories(Data.foodCategories);
    await Seed.insertProductionCompanies(Data.productionCompanies);
    await Seed.insertFoods(await Data.foods);
    await Seed.attachCategoriesToFoods(await Data.foodsCategoriesIds); 
};
