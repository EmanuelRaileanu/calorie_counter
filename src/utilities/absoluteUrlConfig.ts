import dotenv from 'dotenv';

dotenv.config();

const absoluteUrl = `${process.env.API_URL}:${process.env.SERVER_PORT}/`;

export default absoluteUrl;