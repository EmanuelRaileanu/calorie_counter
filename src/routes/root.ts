import express from 'express';
import asyncMiddleware from '../utilities/asyncMiddleware';
import * as controller from '../controllers/root_controller';

export const register = (router: express.Router) => {
    router.get('/', asyncMiddleware(controller.getRoot));
};