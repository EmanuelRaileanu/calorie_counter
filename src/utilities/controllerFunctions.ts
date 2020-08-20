import express from 'express';
import bookshelf from './bookshelfconfig';
import * as type from './customTypes';
import Food from '../entities/foodsModel';
import ProductionCompany from '../entities/productionCompaniesModel';
import Country from '../entities/countriesModel';
import FoodCategory from '../entities/foodCategoriesModel';

export async function fetchFoods(){
    return await new Food().fetchAll({
        require: false, 
        withRelated: ['categories', 'producedIn', 'producedBy']
    });
};

export async function fetchFoodById(id: number){
    return await new Food({id}).fetch({
        require: false,
        withRelated: ['categories', 'producedIn', 'producedBy']
    });
};

export async function fetchFoodByName(name: string){
    return await new Food({name}).fetch({
        require: false,
        withRelated: ['categories', 'producedIn', 'producedBy']
    });
};

async function restructureBody(body: type.Food, trx: any = null){
    const restructuredBody = body;
    if(!body.productionCompanyId && body.productionCompanyName){
        body.productionCompanyId = await new ProductionCompany({name: body.productionCompanyName}).getId(trx);
        delete body.productionCompanyName;
    }
    if(!body.countryId && body.countryName){
        body.countryId = await new Country({name: body.countryName}).getId(trx);
        delete body.countryName;
    }
    return restructuredBody;
}

export async function saveFoodItem(req: express.Request){
    return await bookshelf.transaction(async trx => {
        const body = await restructureBody(req.body, trx);
        let categoriesIds;
        if(body.categories){
            categoriesIds = await Promise.all(body.categories.map(async category => await new FoodCategory({category}).getId(trx)));
            delete req.body.categories;
        }
        const id = (await new Food().save(body, {transacting: trx, method: 'insert'})).get('id');
        if(categoriesIds){
            await new Food({id}).categories().attach(categoriesIds, {transacting: trx});
        }
        return id;
    });
};

export async function updateFoodItem(req: express.Request){
    await bookshelf.transaction(async trx => {
        const id = req.params.id;
        const body = await restructureBody(req.body, trx);
        const foodItem = await new Food({id}).fetch({require: false, transacting: trx, withRelated: ['categories']});
        if(body.categories){
            const oldCategories = foodItem.related('categories');
            const oldCategoriesIds = await Promise.all(oldCategories.map((oldCategory: any) => oldCategory.id));
            foodItem.categories().detach(oldCategoriesIds, {transacting: trx});
            const categoriesIds = await Promise.all(body.categories.map(async category => await new FoodCategory({category}).getId(trx)));
            foodItem.categories().attach(categoriesIds, {transacting: trx});
            delete req.body.categories;
        }
        await foodItem.save(body, {transacting: trx, method: 'update'});
    });
};

export async function deleteFoodItem(id: number){
    await bookshelf.transaction(async trx => {
        const foodItem = await new Food({id}).fetch({require: false, transacting: trx, withRelated: ['categories']});
        const categories = foodItem.related('categories');
        const categoriesIds = categories.map((category: any) => category.id);
        foodItem.categories().detach(categoriesIds, {transacting: trx});
        await foodItem.destroy({transacting: trx});
    });
};