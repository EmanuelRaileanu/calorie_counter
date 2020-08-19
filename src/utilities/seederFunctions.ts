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

export async function insertProductionCompanies(productionCompanies: string[]): Promise<void>{
    for(const productionCompany of productionCompanies){
        if(!await new ProductionCompany({name: productionCompany}).checkIfAlreadyExists()){
            await new ProductionCompany({name: productionCompany}).save();
        }
    }
}

export async function insertFoods(foods: type.Food[]): Promise<void>{
    for(const food of foods){
        if(!await new Food(food).checkIfAlreadyExists()){
            await new Food(food).save();
        }
    }
}

async function checkIfAssociatedDataAlreadyExists(relatedDataIds: number[], associations: number[]): Promise<boolean>{
    for(const association of associations){
        if(relatedDataIds.includes(association)){
            return true;
        }
    }
    return false;
}

async function attachNewRelatedDataToModel(model: any, relatedFieldName: string, relatedDataIds: number[]): Promise<void>{
    await model.related(relatedFieldName).attach(relatedDataIds);
}

export async function attachCategoriesToFoods(foodsCategoriesIdsDictionary: {[foodName: string]: number[]}): Promise<void>{
    for(const foodName in foodsCategoriesIdsDictionary){
        const food = await new Food({name: foodName}).fetch({require: false, withRelated: ['categories']});
        if(!await checkIfAssociatedDataAlreadyExists(food.related('categories').toJSON().map((c: any) => c.id), foodsCategoriesIdsDictionary[foodName])){
            await attachNewRelatedDataToModel(food, 'categories', foodsCategoriesIdsDictionary[foodName]);
        }
    }
}

export async function attachCountriesToProductionCompanies(productionCompaniesCategoriesIdsDictionary: {[companyName: string]: number[]}): Promise<void>{
    for(const productionCompanyName in productionCompaniesCategoriesIdsDictionary){
        const productionCompany = await new ProductionCompany({name: productionCompanyName}).fetch({require: false, withRelated: ['countries']});
        if(!await checkIfAssociatedDataAlreadyExists(productionCompany.related('countries').toJSON().map((p: any) => p.id), productionCompaniesCategoriesIdsDictionary[productionCompanyName])){
            await attachNewRelatedDataToModel(productionCompany, 'countries', productionCompaniesCategoriesIdsDictionary[productionCompanyName]);
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

