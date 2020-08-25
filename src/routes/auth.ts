import express from 'express';
import * as controller from '../controllers/auth_controller';
import asyncMiddleware from '../utilities/asyncMiddleware';
import passport from 'passport';

export const register = async (router: express.Router) => {
    router.post('/register', asyncMiddleware(controller.register));
    router.post('/login', asyncMiddleware(controller.login));
    router.post('/logout', passport.authenticate('bearer', {session: false}), asyncMiddleware(controller.logout));
    router.post('/change-password', asyncMiddleware(controller.changePassword));
    router.post('/reset-password/:email', asyncMiddleware(controller.resetPassword));
};