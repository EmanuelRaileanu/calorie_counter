import express from 'express';
import * as db from '../utilities/controllerFunctions';
import * as handler from '../utilities/exceptionHandlers';
import asyncMiddleware from '../utilities/asyncMiddleware';

export const getFoods = async (req: express.Request, res: express.Response) => {
    const foods = await db.fetchFoods();
    res.json(foods);
};

export const getFoodByName = async (req: express.Request, res: express.Response) => {
    const food = await db.fetchFoodByName(req.params.name);
    await handler.handleGettingFoodByNameExceptions(food);
    res.json(food);
};

export const postFood = async (req: express.Request, res: express.Response) => {
    await handler.handleFoodPostingExceptions(req);
    const id = await db.saveFoodItem(req);
    const newFoodItem = await db.fetchFoodById(id);
    res.json(newFoodItem);
};

export const putFood = async (req: express.Request, res: express.Response) => {
    await handler.handleFoodUpdateExceptions(req);
    await db.updateFoodItem(req);
    const updatedFoodItem = await db.fetchFoodById(parseInt(req.params.id));
    res.json(updatedFoodItem);
};

export const deleteFood = async (req: express.Request, res: express.Response) => {
    await handler.handleFoodDeletionExceptions(req);
    await db.deleteFoodItem(parseInt(req.params.id));
    res.status(204).send();
};