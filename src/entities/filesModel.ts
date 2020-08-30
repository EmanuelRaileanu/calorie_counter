import BaseModel from './baseModel';
import Food from './foodsModel';
import absoluteUrl from '../utilities/absoluteUrlConfig';

export default class File extends BaseModel{
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