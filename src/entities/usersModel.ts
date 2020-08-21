import BaseModel from './baseModel';

class User extends BaseModel{
    get tableName(){
        return 'users';
    }
};

export default User;