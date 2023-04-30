import sensor from 'node-dht-sensor';
import { sound } from '../sounds/index.js'
import { addEvent } from '../logging/events.js';
import { triggerAutomation } from '../automations/index.js';
import fs from 'fs';

export const temperatureCron = async () => {
    try {
        await sensor.read(22, 4, (err, temperature, humidity) => {
            if (!err) {
                fs.writeFileSync("tempHumid.json", JSON.stringify({
                    temperature: temperature,
                    humidity: humidity
                }));

                const manifest = JSON.parse(fs.readFileSync("manifest.json"));
                const temp = manifest.temperature;
                const humid = manifest.humidity;


                if (temp.max < temperature) {
                    if (!fs.existsSync("tempLimit.lock")) {
                        fs.writeFileSync("tempLimit.lock", "true");
                        triggerAutomation("temperatureHigh", [temperature, temp.max]);
                        addEvent({
                            type: "Temperature",
                            title: "Max Temperature Reached",
                            description: `The current temperature is ${Math.round(temperature)}°C, which is higher than the maximum temperature of ${temp.max}°C.`,
                            timestamp: Date.now(),
                            trigger: "CRON"
                        });
                    }
                } else {
                    if (!fs.existsSync("tempLimit.lock")) {
                        fs.rmSync("tempLimit.lock");
                    }
                }
            } else {
                console.log(err);
                sound('sounds/temperaturefailure.mp3');
            }
        })
    } catch (err) {

    }
}