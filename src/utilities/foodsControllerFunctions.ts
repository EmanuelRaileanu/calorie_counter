import express from 'express';
import bookshelf from './bookshelfConfig';
import * as type from './customTypes';
import Food from '../entities/foodsModel';
import ProductionCompany from '../entities/productionCompaniesModel';
import Country from '../entities/countriesModel';
import FoodCategory from '../entities/foodCategoriesModel';
import File from '../entities/filesModel';
import util from 'util';
import fs from 'fs';
import User from '../entities/usersModel';

const deleteFile = util.promisify(fs.unlink);

export async function fetchFoods(req: express.Request){
    const reg = /^[0-9]+/;
    const length = parseInt(String(await new Food().length));
    const page = parseInt(reg.test(String(req.query.page))? String(req.query.page) : '1') || 1;
    const pageSize = parseInt(reg.test(String(req.query.pageSize))? String(req.query.pageSize) : '10') || 10;
    const pageCount = Math.ceil(length / pageSize);
    const foods = await new Food().fetchPage({
        require: false, 
        page,
        pageSize,
        withRelated: ['categories', 'producedIn', 'producedBy', 'picture']
    });
    const pagination = {
        page,
        pageSize,
        pageCount
    };
    return{
        foods,
        pagination
    };
};

export async function fetchFoodById(id: number){
    return await new Food({id}).fetch({
        require: false,
        withRelated: ['categories', 'producedIn', 'producedBy', 'picture']
    });
};

export async function fetchFoodCategories(){
    return await new FoodCategory().fetchAll({require: false});
};

export async function fetchFoodByName(req: express.Request){
    const reg = /^[0-9]+/;
    const length = parseInt(String(await new Food().length));
    const page = parseInt(reg.test(String(req.query.page))? String(req.query.page) : '1') || 1;
    const pageSize = parseInt(reg.test(String(req.query.pageSize))? String(req.query.pageSize) : '10') || 10;
    const pageCount = Math.ceil(length / pageSize);
    const foods = await new Food().where('name', 'regexp', `(^| )${req.params.name}`).fetchAll({
        require: false,
        withRelated: ['categories', 'producedIn', 'producedBy', 'picture']
    });
    const pagination = {
        page,
        pageSize,
        pageCount
    };
    return{
        foods,
        pagination
    };
};

async function restructureBody(body: type.Food, trx: any = null){
    const restructuredBody = body;
    if(!body.productionCompanyId && body.productionCompany){
        body.productionCompanyId = await new ProductionCompany({name: body.productionCompany}).getId(trx);
        delete body.productionCompany;
    }
    if(!body.countryId && body.country){
        body.countryId = await new Country({name: body.country}).getId(trx);
        delete body.country;
    }
    return restructuredBody;
};

async function saveFoodPicture(req: express.Request, trx: any){
    const file = {
        originalFileName: req.file.originalname,
        mimeType: req.file.mimetype,
        relativePath: req.file.path,
        size: req.file.size,
        fileName: req.file.filename
    };
    return await new File().save(file, {transacting: trx, method: 'insert'});
};

async function saveFoodPictureIfItExistsAndReturnId(req: express.Request, trx: any){
    if(req.file){
        return (await saveFoodPicture(req, trx)).get('id');
    }
    return null;
};

async function deleteOldFile(id: number, oldPhotoPath: string, trx: any){
    await new File().where({id}).destroy({transacting: trx});
    await deleteFile(oldPhotoPath);
}

async function updateFoodPictureIfItExistsAndReturnId(req: express.Request, trx: any){
    if(req.file){
        const currentFoodItem = await new Food({id: req.params.id}).fetch({require: false, transacting: trx});
        const oldPictureId = currentFoodItem.get('pictureId');
        const oldPhotoPath = (await new File({id: oldPictureId}).fetch({require: false, transacting: trx})).get('relativePath');
        if(oldPhotoPath){
            await currentFoodItem.save({pictureId: null}, {transacting: trx, method: 'update'});
            await deleteOldFile(oldPictureId, oldPhotoPath, trx);
        }
        return await saveFoodPictureIfItExistsAndReturnId(req, trx);
    }
    return null;
}

export async function saveFoodItem(req: express.Request){
    return await bookshelf.transaction(async trx => {
        const body = await restructureBody(req.body, trx);
        let categoriesIds;
        if(body.categories){
            categoriesIds = await Promise.all(body.categories.map(async category => await new FoodCategory({category}).getId(trx)));
            delete body.categories;
        }
        body.pictureId = await saveFoodPictureIfItExistsAndReturnId(req, trx);
        const id = (await new Food().save(body, {transacting: trx, method: 'insert'})).get('id');
        if(categoriesIds){
            await new Food({id}).categories().attach(categoriesIds, {transacting: trx});
        }
        return id;
    });
};

async function getUserRelatedFoodsIds(userId: number, trx: any){
    const user = await new User({id: userId}).fetch({require: false, transacting: trx, withRelated:['foods']})
    const foodsIds = user.related('foods').toJSON().map((food: any) => food.id);
    return foodsIds;
};

async function checkIfUserFoodAlreadyExists(food: any, trx: any){
    const user = await new User({id: food.userId}).fetch({require: false, transacting: trx, withRelated: ['foods']});
    const foodsIds = user.related('foods').map((food: any) => food.id);
    if(foodsIds.find((foodId: any) => foodId === food.foodId)){
        return true;
    }
    return false;
};

export async function attachUserFoods(req: any){
    await bookshelf.transaction(async trx => {
        const userId = req.user.id;
        for(const food of req.body.foods){
            food.userId = userId;
            food.foodId = await new Food({name: food.name}).getId(trx);
            delete food.name;
            if(await checkIfUserFoodAlreadyExists(food, trx)){
                const oldGrams = (await bookshelf.knex('users_foods').where({userId, foodId: food.foodId}).select('grams').first()).grams;
                await bookshelf.knex('users_foods').where({userId, foodId: food.foodId}).update({grams: oldGrams + food.grams});
            }else{
                await bookshelf.knex('users_foods').insert(food);
            }
        }
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
            delete body.categories;
        }
        body.pictureId = await updateFoodPictureIfItExistsAndReturnId(req, trx);
        await foodItem.save(body, {transacting: trx, method: 'update'});
    });
};

export async function deleteFoodItem(id: number){
    await bookshelf.transaction(async trx => {
        const foodItem = await new Food({id}).fetch({require: false, transacting: trx, withRelated: ['categories']});
        const categories = foodItem.related('categories');
        const categoriesIds = categories.map((category: any) => category.id);
        const pictureId = foodItem.get('pictureId');
        foodItem.categories().detach(categoriesIds, {transacting: trx});
        await foodItem.destroy({transacting: trx});
        const oldPhotoPath = (await new File({id: pictureId}).fetch({require: false, transacting: trx})).get('relativePath');
        if(oldPhotoPath){
            await deleteOldFile(pictureId, oldPhotoPath, trx);
        }
    });
};

export async function detachUserRelatedFoods(req: any){
    await bookshelf.transaction(async trx => {
        const foodsIds = await getUserRelatedFoodsIds(req.user.id, trx);
        await new User({id: req.user.id}).foods().detach(foodsIds, {transacting: trx});
    });
};

