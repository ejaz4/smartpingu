import { app } from '../app.js'
import { verifySession } from '../auth/index.js';
import fs from 'fs';

export const temperatureRoutes = () => {
    app.get("/temperature/now", (res,req) => {
        const temperatureFile = JSON.parse(fs.readFileSync("tempHumid.json"));

        return temperatureFile;
    })
}