import express from 'express';
import ProductionCompany from '../entities/productionCompaniesModel';
import * as type from './customTypes';

export async function fetchProductionCompanies(){
    return await new ProductionCompany().query(q => {
        q.leftJoin('foods', 'production_companies.id', '=', 'foods.productionCompanyId');
        q.groupBy('production_companies.id');
        q.select('production_companies.*');
        q.count('foods.productionCompanyId as totalFoodsMade');
    }).fetchAll({require: false});
};

export async function fetchProductionCompanyById(id: number){
    return await new ProductionCompany({id}).query(q => {
        q.leftJoin('foods', 'production_companies.id', '=', 'foods.ProductionCompanyId');
        q.groupBy('production_companies.id');
        q.select('production_companies.*');
        q.count('foods.productionCompanyId as totalFoodsMade');
    }).fetch({require: false});
};

export async function saveProductionCompany(body: type.ProductionCompany){
    const productionCompany = await new ProductionCompany(body).save();
    return productionCompany.get('id');
};

export async function updateProductionCompany(req: express.Request){
    const productionCompany = await new ProductionCompany({id: req.params.id}).save(req.body, {method: 'update'});
    return productionCompany.get('id');
};

export async function deleteProductionCompany(id: number){
    await new ProductionCompany().where({id}).destroy();
};

