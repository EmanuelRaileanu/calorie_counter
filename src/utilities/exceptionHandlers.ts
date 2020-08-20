import express from 'express';
import Food from "../entities/foodsModel";
import * as type from './customTypes';
import Country from "../entities/countriesModel";
import ProductionCompany from "../entities/productionCompaniesModel";

export async function handleGettingFoodByNameExceptions(item: any){
    if(!item){
        throw 'Food item not found.';
    }
};

export async function handleFoodPostingExceptions(body: type.Food){
    if(!body.name){
        throw 'Bad request. Please specify a name.';
    }else if(body.caloriesPer100Grams === undefined){
        throw 'Bad request. Please specify calorie amount.';
    }else if(body.proteinPer100Grams === undefined){
        throw 'Bad request. Please specify protein amount.';
    }else if(body.carbohydratesPer100Grams === undefined){
        throw 'Bad request. Please specify carbohydrates amount.';
    }else if(body.fatPer100Grams === undefined){
        throw 'Bad request. Please specify fat amount.';
    }else if(body.fiberPer100Grams === undefined){
        throw 'Bad request. Please specify fiber amount.';
    }else if(await new Food({
        name: body.name,
        caloriesPer100Grams: body.caloriesPer100Grams,
        proteinPer100Grams: body.proteinPer100Grams,
        carbohydratesPer100Grams: body.carbohydratesPer100Grams,
        fatPer100Grams: body.fatPer100Grams,
        fiberPer100Grams: body.fiberPer100Grams,
        countryId: body.countryId || await new Country({name: body.countryName}).getId() || null,
        productionCompanyId: body.productionCompanyId || await new ProductionCompany({name: body.productionCompanyName}).getId() || null
    }).checkIfAlreadyExists()){
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
        throw 'The food item cannot be deleted because it does not exist!';
    }
};