import BaseModel from './baseModel';
import Food from './foodsModel';

class File extends BaseModel{
    get tableName(){
        return 'files';
    }

    food(){
        return this.belongsTo(Food, 'id', 'pictureId');
    }
};

export default File;