import express from 'express';

const asyncMiddleware = (fn: any) =>
  async (req: express.Request, res: express.Response) => {
    try {
        await Promise.resolve(fn(req, res));
    }catch(err){
        res.status(500).json({
            status: err.toString()
        });
    }
};

export default asyncMiddleware;