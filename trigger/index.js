// Trigger controlled for the demonstration of the project

import { app } from '../index.js'
import fs from 'fs';
import { sound } from '../sounds'

const triggerRoutes = () => {
    app.post('/trigger/network', (req, res) => {
        console.log('Network Triggered')
        const networkFile = JSON.parse(fs.readFileSync("network.json"));

        networkFile.push({
            "name": "Apple iPhone XR",
            "ip": "192.168.0.19",
            "mac": "d4:9a:20:10:f7:72",
            "firstSeen": Date.now(),
            "vendor": ["Apple, Inc."]
        })

        fs.writeFileSync("network.json", JSON.stringify(networkFile));
    })

    app.post("/trigger/temperature", (req, res) => {

        const body = JSON.parse(req.body);
        console.log('Temperature Triggered')
        const temperatureFile = JSON.parse(fs.readFileSync("tempHumid.json"));

        fs.writeFileSync("tempHumid.json", JSON.stringify({
            temperature: body.temperature,
            humidity: body.humidity
        }));

        const manifest = JSON.parse(fs.readFileSync("manifest.json"));
            const temp = manifest.temperature;
            const humid = manifest.humidity;

            if (temp.max < body.temperature) {
                addEvent({
                    type: "Temperature",
                    title: "Max Temperature Reached",
                    description: `The current temperature is ${Math.round(body.temperature)}°C, which is higher than the maximum temperature of ${temp.max}°C.`,
                    timestamp: Date.now(),
                    trigger: "CRON"
                });

                sound("sounds/temperaturehigh.mp3");

            }

            if (humid.max < body.humidity) {
                addEvent({
                    type: "Humidity",
                    title: "Max Humidity Reached",
                    description: `The current humidity is ${Math.round(body.temperature)}%, which is higher than the maximum humidity of ${temp.max}%.`,
                    timestamp: Date.now(),
                    trigger: "CRON"
                });

                sound("");
            }
    })
}