import { app } from '../app.js';
import fs from 'fs';
import { verifySession } from './index.js';
import { sound } from '../sounds/index.js';
import { checkForUpdate, updateNow } from '../update/index.js';

export const settingsRoutes = () => {
    app.get('/settings', (req, res) => {
        const manifest = fs.readFileSync("manifest.json");
        const manifestJSON = JSON.parse(manifest);
        res.send({
            "version": manifestJSON.version,
            "deviceName": manifestJSON.deviceName,
            "settings": manifest.settings,
            "setup": manifestJSON.setup,
            "oobe": manifestJSON.oobe,
            "soundTest": manifestJSON.soundTest,
            "temperature": manifestJSON.temperature,
            "humidity": manifestJSON.humidity,
            "network": manifestJSON.network,
            "sounds": manifestJSON.sounds
        });
    });

    app.post('/settings', (req, res) => {
        const sessionID = verifySession(req.headers['session-id']);


        if (!sessionID) {
            res.status(403).send({
                status: "error",
                message: "No session ID provided"
            });
        }

        if (sessionID) {
            const manifest = fs.readFileSync("manifest.json", { encoding: 'utf8' });
            const manifestJSON = JSON.parse(manifest);
            const settings = JSON.parse(req.body);

            Object.keys(settings).forEach((key) => {
                manifestJSON[key] = settings[key];
            });

            fs.writeFileSync("manifest.json", JSON.stringify(manifestJSON));
            res.send({
                status: "success"
            });
        }
    })

    app.get('/tests/sound', (req, res) => {
        sound('sounds/test.mp3');
        res.send({
            status: "success"
        })
    })


    app.get("/update/check", async (req, res) => {
        const updates = await checkForUpdate()

        return res.send(updates)
    })

    app.get("/update/download", async (req, res) => {
        await updateNow()

        setTimeout(() => {
            process.exit(0)
        }, 3000)

        res.send({
            status: "success"
        })
    })
}