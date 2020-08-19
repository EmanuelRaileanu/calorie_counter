import BaseModel from './baseModel';
import FoodCategory from './foodCategoriesModel';
import Country from './countriesModel';
import ProductionCompany from './productionCompaniesModel';

class Food extends BaseModel{
    get tableName(){
        return 'foods';
    }

    categories(){
        return this.belongsToMany(FoodCategory, 'foods_categories', 'foodId', 'categoryId');
    }

    producedIn(){
        return this.belongsTo(Country, 'countryId', 'id');
    }

    producedBy(){
        return this.belongsTo(ProductionCompany, 'productionCompanyId', 'id');
    }
};

export default Food;