import * as oracle from './seederFunctions';

class Data{
    static productionCompaniesArray = ['Food and stuff', 'Nestle', 'Heinz', 'Danone', 'Pizza Hut'];
    static countriesArray = ['USA', 'UK', 'China', 'Japan', 'Italy', 'Germany', 'Spain', 'Romania', 'Canada', 'Sweden'];
    static foodCategoriesArray = ['Vegetables', 'Fruits', 'Grains', 'Beans', 'Nuts', 'Meat', 'Fish', 
                                    'Seafood', 'Dairy', 'Eggs', 'Non-alcoholic beverage', 'Alcoholic beverage'];                               
    static foodsArray = async () => [
        {
            name: 'Banana',
            caloriesPer100Grams: 89,
            proteinPer100Grams: 1.1,
            carbohydratesPer100Grams: 20.2,
            fatPer100Grams: 0.3,
            fiberPer100Grams: 2.6,
            productionCompanyId: await oracle.getProductionCompanyId('Food and stuff'),
            countryId: await oracle.getCountryId('Spain')
        },
        {
            name: 'White Bread',
            caloriesPer100Grams: 266,
            proteinPer100Grams: 8.9,
            carbohydratesPer100Grams: 46.7,
            fatPer100Grams: 3.3,
            fiberPer100Grams: 2.6,
            productionCompanyId: await oracle.getProductionCompanyId('Food and stuff'),
            countryId: await oracle.getCountryId('Romania')
        },
        {
            name: 'Scrambled eggs',
            caloriesPer100Grams: 174.3,
            proteinPer100Grams: 11.1,
            carbohydratesPer100Grams: 2.2,
            fatPer100Grams: 13.1,
            fiberPer100Grams: 0,
            productionCompanyId: await oracle.getProductionCompanyId('Food and stuff'),
            countryId: await oracle.getCountryId('Romania')
        },
        {
            name: 'Natural Yogurt',
            caloriesPer100Grams: 91,
            proteinPer100Grams: 3.3,
            carbohydratesPer100Grams: 13.5,
            fatPer100Grams: 2.6,
            fiberPer100Grams: 0,
            productionCompanyId: await oracle.getProductionCompanyId('Danone'),
            countryId: await oracle.getCountryId('USA')
        },
        {
            name: 'Pepperoni Pizza',
            caloriesPer100Grams: 250,
            proteinPer100Grams: 9.2,
            carbohydratesPer100Grams: 24.5,
            fatPer100Grams: 12,
            fiberPer100Grams: 0,
            productionCompanyId: await oracle.getProductionCompanyId('Pizza Hut'),
            countryId: await oracle.getCountryId('USA')
        }
    ];

    static foodsCategoriesIdsDictionary = async () => {
        return {
            'Banana': [await oracle.getFoodCategoryId('Fruits')],
            'Scrambled Eggs': [await oracle.getFoodCategoryId('Eggs')],
            'Natural Yogurt': [await oracle.getFoodCategoryId('Dairy')],
            'Pepperoni Pizza': [await oracle.getFoodCategoryId('Vegetables'), await oracle.getFoodCategoryId('Dairy'), 
                                await oracle.getFoodCategoryId('Meat'), await oracle.getFoodCategoryId('Grains')]
        };
    };

    static productionCompaniesCountriesIdsDictionary = async () => {
        return {
            'Food and Stuff': [await oracle.getCountryId('USA'), await oracle.getCountryId('Spain')],
            'Nestle': [await oracle.getCountryId('USA'), await oracle.getCountryId('UK')],
            'Heinz': [await oracle.getCountryId('Germany')],
            'Danone': [await oracle.getCountryId('USA')],
            'Pizza Hut': [await oracle.getCountryId('USA'), await oracle.getCountryId('Romania')]
        };
    };

    static get productionCompanies(){
        return this.productionCompaniesArray;
    }

    static get countries(){
        return this.countriesArray;
    }

    static get foodCategories(){
        return this.foodCategoriesArray;
    }

    static get foods(){
        return this.foodsArray();
    }

    static get foodsCategoriesIds(){
        return this.foodsCategoriesIdsDictionary();
    }

    static get productionCompaniesCountriesIds(){
        return this.productionCompaniesCountriesIdsDictionary();
    }
}

export default Data;
