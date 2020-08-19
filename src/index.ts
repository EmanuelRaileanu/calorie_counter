import express from 'express';
import dotenv from 'dotenv';
import * as root from './routes/root';
import * as err from './routes/err';

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());

const apiRouter = express.Router();

app.use('/api', apiRouter);

root.register(apiRouter);

err.register(app);

app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});