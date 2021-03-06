import express from 'express';
import * as handler from '../utilities/exceptionHandlers';
import * as db from '../utilities/authControllerFunctions';

export const register = async (req: express.Request, res: express.Response) => {
    await handler.handleRegisterExceptions(req);
    await db.saveUser(req.body);
    res.json(`A confirmation email has been sent to ${req.body.email}. Please confirm your account.`);
};

export const login = async (req: express.Request, res: express.Response) => {
    await handler.handleLoginExceptions(req);
    const bearerToken = await db.grantBearerToken(req.body.email);
    res.json(bearerToken);
};

export const logout = async (req: any, res: express.Response) => {
    await db.destroyBearerToken(req.user?.bearerToken);
    res.json('Logged out successfully!');
};

export const resendConfirmationEmail = async (req: express.Request, res: express.Response) => {
    await handler.handleResendingConfirmationEmailExceptions(req);
    await db.resendConfirmationEmail(req.body.email);
    res.json(res.json(`A confirmation email has been sent to ${req.body.email}. Please confirm your account.`));
};

export const confirmAccount = async (req: any, res: express.Response) => {
    await handler.handleAccountConfirmationExceptions(req);
    await db.confirmAccount(req);
    res.json('Account confirmed!');
};

export const resetPassword = async (req: express.Request, res: express.Response) => {
    await handler.handlePasswordResetExceptions(req);
    await db.sendPasswordResetEmail(req.body.email);
    res.json('Password reset link sent. Please check your email.');
};

export const changePassword = async (req: express.Request, res: express.Response) => {
    await handler.handlePasswordChangeExceptions(req);
    await db.changePassword(req);
    res.json('Password successfully changed.');
};