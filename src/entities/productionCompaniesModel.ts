import BaseModel from './baseModel';
import Food from './foodsModel';
import Country from './countriesModel';

export default class ProductionCompany extends BaseModel{
    get tableName(){
        return 'production_companies';
    }

    foods(){
        return this.hasMany(Food, 'productionCompanyId', 'id');
    }

    countries(){
        return this.belongsToMany(Country, 'production_companies_countries', 'productionCompanyId', 'countryId');
    }
};