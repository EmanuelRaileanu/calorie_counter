import passport, { use } from 'passport';
import User from '../entities/usersModel';
const BearerStrategy = require('passport-http-bearer');
import bookshelf from './bookshelfConfig';

export const configurePassportHttpBearer = () => passport.use(new BearerStrategy(
    async (token: any, done: any) => {
        let user = (await new User({bearerToken: token}).fetch({require: false, withRelated: ['foods']})).toJSON();
        if (!user){ 
            return done(null, false); 
        }
        delete user.password;
        if(user.foods){
            user.foods = await Promise.all(user.foods.map(async (food: any) => {
                food.grams = (await bookshelf.knex('users_foods').where({userId: user.id, foodId: food.id}).select('grams').first()).grams;
                food.calories = (food.grams/100 * food.caloriesPer100Grams).toFixed(1);
                food.protein = (food.grams/100 * food.proteinPer100Grams).toFixed(1);
                food.carbohydrates = (food.grams/100 * food.carbohydratesPer100Grams).toFixed(1);
                food.fat = (food.grams/100 * food.fatPer100Grams).toFixed(1);
                food.fiber = (food.grams/100 * food.fiberPer100Grams).toFixed(1);
                return food;
            }));
            user.totalCaloriesForToday = (user.foods.map((food: any): number => parseFloat(food.calories)).reduce((a: number, b: number): number => a + b, 0)).toFixed(1);
            user.totalProteinForToday = (user.foods.map((food: any): number => parseFloat(food.protein)).reduce((a: number, b: number): number => a + b, 0)).toFixed(1);
            user.totalCarbohydratesForToday = (user.foods.map((food: any): number => parseFloat(food.carbohydrates)).reduce((a: number, b: number): number => a + b, 0)).toFixed(1);
            user.totalFatForToday = (user.foods.map((food: any): number => parseFloat(food.fat)).reduce((a: number, b: number): number => a + b, 0)).toFixed(1);
            user.totalFiberForToday = (user.foods.map((food: any): number => parseFloat(food.fiber)).reduce((a: number, b: number): number => a + b, 0)).toFixed(1);
        }
        return done(null, user, { scope: 'all' });
    }
));