import express from 'express';
import User from '../entities/usersModel';
import * as type from './customTypes';
import bookshelf from './bookshelfconfig';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function saveUser(body: type.User){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt); 
    const newUser = {
        email: body.email,
        password: hashedPassword,
        name: body.name,
        dateOfBirth: body.dateOfBirth
    };
    await new User(newUser).save();
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

