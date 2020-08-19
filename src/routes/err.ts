import express from 'express';
import * as controller from '../controllers/err_controller'

export const register = (app: express.Application) => {
    app.get('*', controller.getErr);
};