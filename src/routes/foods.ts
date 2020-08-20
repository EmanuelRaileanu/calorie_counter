import express from 'express';
import * as controller from '../controllers/foods_controller';
import asyncMiddleware from '../utilities/asyncMiddleware';

export const register = (router: express.Router) => {
    router.get('/foods', asyncMiddleware(controller.getFoods));
    router.get('/foods/:name', asyncMiddleware(controller.getFoodByName));
    router.post('/foods', asyncMiddleware(controller.postFood));
    router.put('/foods/:id', asyncMiddleware(controller.putFood));
    router.delete('/foods/:id', asyncMiddleware(controller.deleteFood));
};