import express from 'express';
import * as controller from '../controllers/foods_controller';
import asyncMiddleware from '../utilities/asyncMiddleware';

export const register = (router: express.Router) => {
    router.get('/foods', asyncMiddleware(controller.getFoods));
};