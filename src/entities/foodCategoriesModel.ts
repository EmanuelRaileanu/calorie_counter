import BaseModel from './baseModel';
import Food from './foodsModel';

class FoodCategory extends BaseModel{
    get tableName(){
        return 'food_categories';
    }

    foods(){
        return this.belongsToMany(Food, 'foods_categories', 'categoryId', 'foodId');
    }
}

export default FoodCategory;