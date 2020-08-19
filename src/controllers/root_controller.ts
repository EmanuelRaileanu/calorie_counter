import express from 'express';

export const getRoot = async (req: express.Request, res: express.Response) => {
    res.json({
        name: 'Calorie Counter',
        version: process.env.npm_package_version
    });
};