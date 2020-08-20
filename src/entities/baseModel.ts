import bookshelf from '../utilities/bookshelfconfig';

class BaseModel extends bookshelf.Model<any>{
    checkIfAlreadyExists(trx: any = null){
        return this.fetch({require: false, transacting: trx});
    }

    getId(trx: any = null){
        const element = this.fetch({require: false, transacting: trx});
        if(element){
            return element.get('id');
        }
        return null;
    }
};

export default BaseModel;