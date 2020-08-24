import express from 'express';
import dotenv from 'dotenv';
import * as root from './routes/root';
import * as err from './routes/err';
import * as foods from './routes/foods';
import * as productionCompanies from './routes/productionCompanies';
import * as auth from './routes/auth';
import passport from 'passport';
import * as authentication from './utilities/authMiddleware';
import cron from 'node-cron';
import clearUsersFoods from './utilities/clearUsersFoods';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use('/public', express.static('public'));

authentication.configurePassportHttpBearer();

const apiRouter = express.Router();
const authRouter = express.Router();

app.use('/api', passport.authenticate('bearer', {session: false}), apiRouter);
root.register(apiRouter);
foods.register(apiRouter);
productionCompanies.register(apiRouter);

app.use('/auth', authRouter);
auth.register(authRouter);

err.register(app);

cron.schedule('0 0 0 * * *', () => {
    // runs every day at 00:00
    clearUsersFoods();
});

app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});