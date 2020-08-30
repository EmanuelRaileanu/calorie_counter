import BaseModel from './baseModel';
import Food from './foodsModel';

export default class FoodCategory extends BaseModel{
    get tableName(){
        return 'food_categories';
    }

    foods(){
        return this.belongsToMany(Food, 'foods_categories', 'categoryId', 'foodId');
    }
}