import sensor from 'node-dht-sensor';
import { sound } from '../sounds/index.js'
import fs from 'fs';

export const temperatureCron = () => {
    sensor.read(22, 4, (err, temperature, humidity) => {
        if (!err) {
            fs.writeFileSync("tempHumid.json", JSON.stringify({
                temperature: temperature,
                humidity: humidity
            }));
        } else {
            console.log(err);
            sound('sounds/temperaturefailure.mp3');
        }
    })
}