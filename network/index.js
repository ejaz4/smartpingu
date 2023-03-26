import { app } from '../app.js'
import { verifySession } from '../auth/index.js';
import fs from 'fs';
import { networkCron } from './cron.js';

export const networkRoutes = () => {
    app.get('/network/listDevices', (req, res) => {
        const devices = JSON.parse(fs.readFileSync('network.json', 'utf8'));

        res.send(devices);
    });

    app.get("/network/rescan", async(req,res) => {
        await networkCron()

        res.send({
            status: "success"
        })
    })
}