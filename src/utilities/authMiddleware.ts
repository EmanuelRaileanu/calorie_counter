import passport from 'passport';
import User from '../entities/usersModel';
import bookshelf from './bookshelfConfig';
import * as type from './customTypes';
import Bearer from 'passport-http-bearer';

export const configurePassportHttpBearer = () => passport.use(new Bearer.Strategy(
    async (token: string, done: (x: null, data: type.User | boolean, object?: { scope: string }) => type.User | void) => {
        let user = (await new User({bearerToken: token}).fetch({require: false, withRelated: ['foods']})).toJSON();
        if (!user){ 
            return done(null, false); 
        }
        delete user.password;
        if(user.foods){
            user.foods = await Promise.all(user.foods.map(async (food: type.Food) => {
                food.grams = parseFloat((await bookshelf.knex('users_foods').where({userId: user.id, foodId: food.id}).select('grams').first()).grams);
                food.calories = parseFloat((food.grams/100 * food.caloriesPer100Grams).toFixed(1));
                food.protein = parseFloat((food.grams/100 * food.proteinPer100Grams).toFixed(1));
                food.carbohydrates = parseFloat((food.grams/100 * food.carbohydratesPer100Grams).toFixed(1));
                food.fat = parseFloat((food.grams/100 * food.fatPer100Grams).toFixed(1));
                food.fiber = parseFloat((food.grams/100 * food.fiberPer100Grams).toFixed(1));
                return food;
            }));
            user.totalCaloriesForToday = parseFloat((user.foods.map((food: type.Food) => food.calories).reduce((a: number, b: number) => a + b, 0)).toFixed(1));
            user.totalProteinForToday = parseFloat((user.foods.map((food: type.Food) => food.protein).reduce((a: number, b: number) => a + b, 0)).toFixed(1));
            user.totalCarbohydratesForToday = parseFloat((user.foods.map((food: type.Food) => food.carbohydrates).reduce((a: number, b: number) => a + b, 0)).toFixed(1));
            user.totalFatForToday = parseFloat((user.foods.map((food: type.Food) => food.fat).reduce((a: number, b: number) => a + b, 0)).toFixed(1));
            user.totalFiberForToday = parseFloat((user.foods.map((food: type.Food) => food.fiber).reduce((a: number, b: number) => a + b, 0)).toFixed(1));
        }
        return done(null, user, { scope: 'all' });
    }
));