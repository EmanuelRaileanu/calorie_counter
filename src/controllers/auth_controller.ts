import express from 'express';
import * as handler from '../utilities/exceptionHandlers';
import * as db from '../utilities/authControllerFunctions';

export const register = async (req: express.Request, res: express.Response) => {
    await handler.handleRegisterExceptions(req);
    await db.saveUser(req.body);
    res.json('Registerd successfully!');
};

export const login = async (req: express.Request, res: express.Response) => {
    await handler.handleLoginExceptions(req);
    const bearerToken = await db.grantBearerToken(req.body.email);
    res.json(bearerToken);
};

export const logout = async (req: any, res: express.Response) => {
    await db.destroyBearerToken(req.user.bearerToken);
    res.json('Logged out successfully!');
};

export const resetPassword = async (req: any, res: express.Response) => {
    await handler.handlePasswordResetExceptions(req);
    await db.sendPasswordResetEmail(req.params.email);
    res.json('Password reset link sent. Please check your email.');
};

export const changePassword = async (req: express.Request, res: express.Response) => {
    await handler.handlePasswordChangeExceptions(req);
    await db.changePassword(req);
    res.json('Password successfully changed.');
};