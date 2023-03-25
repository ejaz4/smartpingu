// Task scheduler
import fs from "fs";
import { networkCron } from "../network/cron.js"
import { temperatureCron } from "../temperature/cron.js"
import { checkForUpdate, updateNow } from "../update/index.js";

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

    setInterval(async() => {
        const check = await checkForUpdate();
        if (check.update) {
            updateNow();
            setTimeout(() => {
                process.exit(0)
            },3000)
        }
    }, 10 * 60 * 1000);
}
