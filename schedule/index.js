// Task scheduler
import fs from "fs";
import { networkCron } from "../network/cron.js"
import { temperatureCron } from "../temperature/cron.js"

export const taskScheduler = () => {
    setInterval(() => {
        const manifest = JSON.parse(fs.readFileSync("manifest.json"));
        if (manifest["network"]["enabled"]) {
            networkCron();
        }
    }, 60000)
    
    setInterval(() => {
        const manifest = JSON.parse(fs.readFileSync("manifest.json"));
        if (manifest["temperature"]["enabled"]) {
            temperatureCron();
        }
    }, 45000)
}