import express from 'express';

export const getErr = async (req: express.Request, res: express.Response) => {
    res.status(404).json('Page not found.');
}; 