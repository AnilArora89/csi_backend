import { config as conf } from 'dotenv'
conf();
const _config = {
    port: process.env.PORT,
    databaseUrl: process.env.MONGO_CONNECTION_STRING,
    env: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    api_secret: process.env.API_SECRET,
    api_key: process.env.API_KEY

}

export const config = Object.freeze(_config);

//freeze is used to make config read-only