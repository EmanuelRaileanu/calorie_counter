import express from 'express';
import User from '../entities/usersModel';
import * as type from './customTypes';
import bookshelf from './bookshelfConfig';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import transporter from './mailConfig';
import dotenv from 'dotenv';

dotenv.config();

async function sendConfirmationEmail(email: string, confirmationToken: string){
    await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Confirm your account',
        text: `Please access the followink link to confirm your account: ${process.env.API_URL}:${process.env.SERVER_PORT}/auth/confirm-account/?confirmationToken=${confirmationToken}`
    });
};

export async function saveUser(body: type.User){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    const confirmationToken = crypto.randomBytes(20).toString('hex');
    const newUser = {
        email: body.email,
        password: hashedPassword,
        name: body.name,
        dateOfBirth: body.dateOfBirth,
        confirmationToken
    };
    await new User(newUser).save();
    await sendConfirmationEmail(body.email, confirmationToken);
};

export async function grantBearerToken(email: string){
    return await bookshelf.transaction(async trx => {
        const user = await new User({email}).fetch({require: false, transacting: trx});
        const bearerToken = crypto.randomBytes(20).toString('hex');
        await user.save({bearerToken}, {transacting: trx, method: 'update'});
        return bearerToken;
    });
};

export async function destroyBearerToken(bearerToken: string){
    await new User().where({bearerToken}).save({bearerToken: null}, {method: 'update'});
};

export async function resendConfirmationEmail(email: string){
    const confirmationToken = (await new User({email}).fetch({require: false})).get('confirmationToken');
    await sendConfirmationEmail(email, confirmationToken);
};

export async function confirmAccount(req: express.Request){
    const confirmationToken = req.query.confirmationToken;
    await new User().where({confirmationToken}).save({isConfirmed: true, confirmationToken: null}, {method: 'update'});
};

export async function sendPasswordResetEmail(email: string){
    const passwordResetToken = crypto.randomBytes(20).toString('hex');;
    await new User().where({email}).save({passwordResetToken}, {method: 'update'});
    await transporter.sendMail({
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Password reset',
        text: `To change your password please access ${process.env.API_URL}:${process.env.SERVER_PORT}/auth/change-password/?passwordResetToken=${passwordResetToken}.`
    });
};

export async function changePassword(req: express.Request){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    if(req.query.passwordResetToken){
        await new User().where({passwordResetToken: req.query.passwordResetToken}).save({password: hashedPassword, passwordResetToken: null}, {method: 'update'});
    }else{
        await new User().where({bearerToken: req.headers.authorization?.split(' ')[1]}).save({password: hashedPassword, passwordResetToken: null}, {method: 'update'});
    }
};
