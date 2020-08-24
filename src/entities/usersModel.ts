import BaseModel from './baseModel';
import Food from './foodsModel';

class User extends BaseModel{
    get tableName(){
        return 'users';
    }

    foods(){
        return this.belongsToMany(Food, 'users_foods', 'userId', 'foodId');
    }
};

export default User;