import express from 'express';
import Food from "../entities/foodsModel";
import Country from "../entities/countriesModel";
import ProductionCompany from '../entities/productionCompaniesModel';
import User from '../entities/usersModel';
import util from 'util';
import fs from 'fs';
import * as type from './customTypes';
import bcrypt from 'bcrypt';

const deleteFile = util.promisify(fs.unlink);

async function checkEmail(email: string){
    if(!email){
        throw 'Please enter your email.';
    }else if(!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
        throw 'Invalid email format. Example format: emailaddress@gmail.com';
    }
};

async function checkPasswords(password: string, confirmPassword: string){
    if(!password){
        throw 'Please enter your password.';
    }else if(!confirmPassword){
        throw 'Please confirm your password.';
    }else if(password.length < 6){
        throw 'The password should be at least 6 characters long.';
    }else if(password !== confirmPassword){
        throw 'Passwords do not match.';
    }
};

export async function handleGettingFoodByIdExceptions(item: type.Food){
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


export async function handleGettingProductionCompanyByIdExceptions(productionCompany: type.ProductionCompany){
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

export async function handleRegisterExceptions(req: express.Request){
    await checkEmail(req.body.email);
    if(await new User({email: req.body.email}).checkIfAlreadyExists()){
        throw 'An user with this email address alredy exists.';
    }
    await checkPasswords(req.body.password, req.body.confirmPassword);
    if(!req.body.name){
        throw 'Please enter your name.';
    }else if(!req.body.dateOfBirth){
        throw 'Please enter your date of birth.';
    }else if(!req.body.dateOfBirth.match(/^\d{4}([-])\d{2}\1\d{2}$/)){
        throw 'Incorrect date format. Hint: YYYY-MM-DD';
    }
};

export async function handleLoginExceptions(req: express.Request){
    await checkEmail(req.body.email);
    const user = await new User({email: req.body.email}).fetch({require: false});
    if(!user.get('isConfirmed')){
        throw 'Please confirm your account first!';
    }else if(!req.body.password){
        throw 'Please enter your password.';
    }else if(!user.get('password')){    
        throw 'Invalid credentials.';
    }else if(!await bcrypt.compare(req.body.password, user.get('password'))){
        throw 'Incorrect password';
    }else if(user.get('bearerToken')){
        throw user.get('bearerToken');
    }
};

export async function handleAddingUserRelatedFoodsExceptions(req: express.Request){
    if(!req.body.foods){
        throw 'Bad request. Please enter the foods you would like to add to the list.';
    }
};

export async function handleResendingConfirmationEmailExceptions(req: express.Request){
    checkEmail(req.body.email);
    const user = await new User({email: req.body.email}).fetch({require: false});
    if(!user){
        throw 'Incorrect email.';
    }else if(!user.get('confirmationToken')){
        throw 'This account has already been confirmed.';
    }
};

export async function handleAccountConfirmationExceptions(req: express.Request){
    if(!await new User({confirmationToken: req.query.confirmationToken}).checkIfAlreadyExists()){
        throw 'The account does not exist or has already been confirmed.';
    }
};

export async function handlePasswordResetExceptions(req: express.Request){
    await checkEmail(req.body.email);
    if(!await new User({email: req.body.email}).checkIfAlreadyExists()){
        throw 'Incorrect email address.';
    }
};

export async function handlePasswordChangeExceptions(req: express.Request){
    if(req.query.passwordResetToken && !await new User({passwordResetToken: req.query.passwordResetToken}).checkIfAlreadyExists()){
        throw 'Invalid password reset token.';
    }
    if(req.headers.authorization && !await new User({bearerToken: req.headers.authorization?.split(' ')[1]}).checkIfAlreadyExists()){
        throw 'Unauthorized';
    }
    await checkPasswords(req.body.password, req.body.confirmPassword);
};