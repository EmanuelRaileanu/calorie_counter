import BaseModel from './baseModel';
import ProductionCompany from './productionCompaniesModel';
import Food from './foodsModel';

class Country extends BaseModel{
    get tableName(){
        return 'countries';
    }

    foods(){
        return this.hasMany(Food, 'countryId', 'id');
    }

    productionCompanies(){
        return this.belongsToMany(ProductionCompany, 'production_companies_countries', 'countryId', 'productionCompanyId');
    }
};

export default Country;