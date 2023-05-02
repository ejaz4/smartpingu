import { app } from '../app.js'
import { verifySession } from '../auth/index.js';
import fs from 'fs';
import { temperatureCron } from './cron.js';

export const temperatureRoutes = () => {
    app.get("/temperature/now", (res, req) => {
        const temperatureFile = JSON.parse(fs.readFileSync("tempHumid.json"));

        return temperatureFile;
    })

    app.get("/temperature/rescan", async (req, res) => {
        await temperatureCron()

        res.send({
            status: "success"
        })
    })

    app.get("/temperature/predict", async (req, res) => {
        const tempHistory = JSON.parse(fs.readFileSync("tempHistory.json"));

        var history = tempHistory.history;
        if (history.length > 1) {
            var now = history[history.length - 1];
            var gradient = (now - history[history.length - 2]) / (0.75 - 0)
            var yIntercept = -((0.75 * gradient) - now)

            var prediction = (yIntercept + (60 * gradient))

            var min = Math.min.apply(Math, history);
            var max = Math.max.apply(Math, history);

            if (max < prediction) prediction = max;
            if (min > prediction) prediction = min;

            res.send({
                point: prediction,
                time: 30
            });
        } else {
            res.send({
                point: history[0],
                time: 2
            });
        }

    })
}