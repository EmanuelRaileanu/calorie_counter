import express from 'express';
import bookshelf from './bookshelfconfig';
import * as type from './customTypes';
import Food from '../entities/foodsModel';
import ProductionCompany from '../entities/productionCompaniesModel';
import Country from '../entities/countriesModel';
import FoodCategory from '../entities/foodCategoriesModel';
import File from '../entities/filesModel';
import util from 'util';
import fs from 'fs';

const deleteFile = util.promisify(fs.unlink);

export async function fetchFoods(){
    return await new Food().fetchAll({
        require: false, 
        withRelated: ['categories', 'producedIn', 'producedBy', 'picture']
    });
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

export async function fetchFoodByName(name: string){
    return await new Food({name}).fetch({
        require: false,
        withRelated: ['categories', 'producedIn', 'producedBy', 'picture']
    });
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
