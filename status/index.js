// Device status routes, they report on the general status of the device.
import { app } from '../app.js';
import os from 'node-os-utils'
import fs from 'fs';

export const statusRoutes = () => {
    app.get('/status', async (req, res) => {
        const time = Date.now();
        var cpu = os.cpu;
        var mem = os.mem;

        const freeMemory = await mem.free();

        res.send({
            time: time,
            cpu: {
                count: cpu.count(),
                usage: cpu.usage(),
                average: cpu.average()
            },
            memory: {
                total: mem.totalMem(),
                free: freeMemory,
            },
        })
    })

    app.get('/info', async (req, res) => {
        const infoFile = fs.readFileSync('manifest.json');
        const info = JSON.parse(infoFile);

        res.send({
            setup: info["setup"],
            version: info["version"],
            deviceName: info["deviceName"],
            oobe: info["oobe"],
            soundTest: info["soundTest"],
            network: info["network"]["enabled"],
            temperature: info["temperature"]["enabled"],
            humidity: info["humidity"]["enabled"],
        })
    })

    app.get("/events", async(req, res) => {
        const eventsFile = fs.readFileSync('events.json');
        const events = JSON.parse(eventsFile);

        res.send(events);
    })
}