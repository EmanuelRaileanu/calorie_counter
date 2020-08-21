import express from 'express';
import ProductionCompany from '../entities/productionCompaniesModel';
import * as db from '../utilities/productionCompaniesControllerFunctions';
import * as handler from '../utilities/exceptionHandlers';

export const getProductionCompanies = async (req: express.Request, res: express.Response) => {
    const productionCompanies = await db.fetchProductionCompanies();
    res.json(productionCompanies);
};

export const getProductionCompanyById = async (req: express.Request, res: express.Response) => {
    const productionCompany = await db.fetchProductionCompanyById(parseInt(req.params.id));
    await handler.handleGettingProductionCompanyByIdExceptions(productionCompany);
    res.json(productionCompany);
};

export const postProductionCompany = async (req: express.Request, res: express.Response) => {
    await handler.handleProductionCompanyPostingExceptions(req);
    const id = await db.saveProductionCompany(req.body);
    const productionCompany = await db.fetchProductionCompanyById(id);
    res.json(productionCompany);
};

export const updateProductionCompany = async (req: express.Request, res: express.Response) => {
    await handler.handleProductionCompanyUpdateExceptions(req);
    const id = await db.updateProductionCompany(req);
    const productionCompany = await db.fetchProductionCompanyById(id);
    res.json(productionCompany);
};

export const deleteProductionCompany = async (req: express.Request, res: express.Response) => {
    await db.deleteProductionCompany(parseInt(req.params.id));
    res.status(204).send();
};