import express from 'express';
import * as controller from '../controllers/foods_controller';
import asyncMiddleware from '../utilities/asyncMiddleware';
import upload from '../utilities/multerConfig';

export const register = (router: express.Router) => {
    router.get('/foods', asyncMiddleware(controller.getFoods));
    router.get('/foods/food-categories', asyncMiddleware(controller.getFoodCategories));
    router.get('/foods/:name', asyncMiddleware(controller.getFoodByName));
    router.post('/foods', upload.single('foodPicture'), asyncMiddleware(controller.postFood));
    router.put('/foods/:id', upload.single('foodPicture'), asyncMiddleware(controller.putFood));
    router.delete('/foods/:id', asyncMiddleware(controller.deleteFood));
};