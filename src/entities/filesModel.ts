import BaseModel from './baseModel';
import Food from './foodsModel';
import absoluteUrl from '../utilities/absoluteUrlConfig';

class File extends BaseModel{
    get tableName(){
        return 'files';
    }

    food(){
        return this.belongsTo(Food, 'id', 'pictureId');
    }

    virtuals: any = {
        url(){
            return absoluteUrl + this.get('relativePath');
        }
    }
};

export default File;