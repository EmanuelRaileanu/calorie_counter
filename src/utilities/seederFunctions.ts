import Food from '../entities/foodsModel';
import FoodCategory from '../entities/foodCategoriesModel';
import Country from '../entities/countriesModel';
import ProductionCompany from '../entities/productionCompaniesModel';
import * as type from './customTypes';
import { ok } from 'assert';

export async function insertCountries(countries: string[]): Promise<void>{
    for(const country of countries){
        if(!await new Country({name: country}).checkIfAlreadyExists()){
            await new Country({name: country}).save();
        }
    }
}

export async function insertFoodCategories(foodCategories: string[]): Promise<void>{
    for(const category of foodCategories){
        if(!await new FoodCategory({category}).checkIfAlreadyExists()){
            await new FoodCategory({category}).save();
        }
    }
}

export async function insertProductionCompanies(productionCompanies: string[]){
    for(const productionCompany of productionCompanies){
        if(!await new ProductionCompany({name: productionCompany}).checkIfAlreadyExists()){
            await new ProductionCompany({name: productionCompany}).save();
        }
    }
}

export async function insertFoods(foods: type.Food[]){
    for(const food of foods){
        if(!await new Food(food).checkIfAlreadyExists()){
            await new Food(food).save();
        }
    }
}

async function checkIfCategoryAssociationAlreadyExists(foodRelatedCategories: number[], foodCategoriesIds: number[]){
    for(const association of foodCategoriesIds){
        if(foodRelatedCategories.includes(association)){
            return true;
        }
    }
    return false;
}

async function attachCategoriesToFood(foodId: number, foodCategoriesIds: number[]){
    await new Food({id: foodId}).categories().attach(foodCategoriesIds);
}

export async function attachCategoriesToFoods(foodsCategoriesIds: {[foodName: string]: number[]}){
    for(const foodName in foodsCategoriesIds){
        const food = await new Food({name: foodName}).fetch({require: false, withRelated: ['categories']});
        if(!await checkIfCategoryAssociationAlreadyExists(food.related('categories').toJSON().map((c: any) => c.id), foodsCategoriesIds[foodName])){
            await attachCategoriesToFood(food.get('id'), foodsCategoriesIds[foodName]);
        }
    }
}

export async function getProductionCompanyId(productionCompanyName: string): Promise<number>{
    return await new ProductionCompany({name: productionCompanyName}).getId();
}

export async function getCountryId(countryName: string): Promise<number>{
    return await new Country({name: countryName}).getId();
}

export async function getFoodCategoryId(category: string): Promise<number>{
    return await new FoodCategory({category}).getId();
}

