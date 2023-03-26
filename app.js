import fastify from 'fastify';
import { setupRoutes } from './routes.js'
import { setupWebUI } from './web/index.js'
import { networkCron } from './network/cron.js'
import cors from '@fastify/cors'
import { taskScheduler } from './schedule/index.js'
import { temperatureCron } from './temperature/cron.js'
export const app = fastify();

import fs from 'fs';
import { startUp } from './setup/index.js'

startUp();

app.get('/', async (request, res) => {
    return `Smartpingu Embedded API`;
});

app.get('/reset', async (req, res) => {
    fs.copyFileSync("example.manifest.json", "manifest.json");
})

app.register(cors, {
    origin: '*'
})

setupRoutes();
setupWebUI();
taskScheduler();

app.listen({
    host: '0.0.0.0',
    port: 3000,
}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening on ${address}`);
});