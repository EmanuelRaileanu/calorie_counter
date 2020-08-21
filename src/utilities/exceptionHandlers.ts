import express from 'express';
import Food from "../entities/foodsModel";
import Country from "../entities/countriesModel";
import ProductionCompany from "../entities/productionCompaniesModel";
import util from 'util';
import fs from 'fs';
import * as type from './customTypes';

const deleteFile = util.promisify(fs.unlink);

export async function handleGettingFoodByNameExceptions(item: type.Food){
    if(!item){
        throw 'Food item not found.';
    }
};

export async function handleFoodPostingExceptions(req: express.Request){
    if(!req.body.name){
        throw 'Bad request. Please specify a name.';
    }else if(req.body.caloriesPer100Grams === undefined){
        throw 'Bad request. Please specify calorie amount.';
    }else if(req.body.proteinPer100Grams === undefined){
        throw 'Bad request. Please specify protein amount.';
    }else if(req.body.carbohydratesPer100Grams === undefined){
        throw 'Bad request. Please specify carbohydrates amount.';
    }else if(req.body.fatPer100Grams === undefined){
        throw 'Bad request. Please specify fat amount.';
    }else if(req.body.fiberPer100Grams === undefined){
        throw 'Bad request. Please specify fiber amount.';
    }else if(await new Food({
        name: req.body.name,
        caloriesPer100Grams: req.body.caloriesPer100Grams,
        proteinPer100Grams: req.body.proteinPer100Grams,
        carbohydratesPer100Grams: req.body.carbohydratesPer100Grams,
        fatPer100Grams: req.body.fatPer100Grams,
        fiberPer100Grams: req.body.fiberPer100Grams,
        countryId: req.body.countryId || await new Country({name: req.body.country}).getId() || null,
        productionCompanyId: req.body.productionCompanyId || await new ProductionCompany({name: req.body.productionCompany}).getId() || null
    }).checkIfAlreadyExists()){
        if(req.file){
            await deleteFile(req.file.path);
        }
        throw 'This food item is already in the database.';
    }
};

export async function handleFoodUpdateExceptions(req: express.Request){
    if(!await new Food({id: req.params.id}).checkIfAlreadyExists()){
        throw 'The food item cannot be updated because it does not exist!';
    }
    else if(!req.body){
        throw 'Bad request. No change specified.';
    }
};

export async function handleFoodDeletionExceptions(req: express.Request){
    if(!await new Food({id: req.params.id}).checkIfAlreadyExists()){
        throw `The food item with the id ${req.params.id} cannot be deleted because it does not exist!`;
    }
};


export async function handleGettingProductionCompanyByIdExceptions(productionCompany: type.productionCompany){
    if(!productionCompany){
        throw 'Production company not found.';
    }
};

export async function handleProductionCompanyPostingExceptions(req: express.Request){
    if(!req.body.name){
        throw 'Bad request. Please specify a name.';
    }
};

export async function handleProductionCompanyUpdateExceptions(req: express.Request){
    if(!await new ProductionCompany({id: req.params.id}).checkIfAlreadyExists()){
        throw `The production company with the id ${req.params.id} cannot be updated because it does not exist!`;
    }
};

export async function handleProductionCompanyDeletionExceptions(req: express.Request){
    if(!await new ProductionCompany({id: req.params.id}).checkIfAlreadyExists()){
        throw `The production company with the id ${req.params.id} cannot be deleted because it does not exist!`;
    }
};