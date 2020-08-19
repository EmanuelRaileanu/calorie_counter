import express from 'express';
import Food from '../entities/foodsModel';

export const getFoods = async (req: express.Request, res: express.Response) => {
    const foods = await new Food().fetchAll({
        require: false, 
        withRelated: ['categories', 'producedIn', 'producedBy']
    });

    res.json(foods);
};

export const getFoodByName = async (req: express.Request, res: express.Response) => {
    const food = await new Food({name: req.params.name}).fetch({
        require: false,
        withRelated: ['categories', 'producedIn', 'producedBy']
    });

    if(!food){
        res.status(404).json('Food item not found.');
        return;
    }

    res.json(food);
};