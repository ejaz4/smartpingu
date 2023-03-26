import { app } from '../app.js'
import { verifySession } from '../auth/index.js';
import fs from 'fs';
import { temperatureCron } from './cron.js';

export const temperatureRoutes = () => {
    app.get("/temperature/now", (res,req) => {
        const temperatureFile = JSON.parse(fs.readFileSync("tempHumid.json"));

        return temperatureFile;
    })

    app.get("/temperature/rescan", async(req,res) => {
        await temperatureCron()

        res.send({
            status: "success"
        })
    })
}