import bookshelf from '../utilities/bookshelfconfig';

class BaseModel extends bookshelf.Model<any>{
    checkIfAlreadyExists(trx: any = null){
        return this.fetch({require: false, transacting: trx});
    }

    getId(trx: any = null){
        return this.fetch({require: false, transacting: trx}).get('id');
    }
};

export default BaseModel;