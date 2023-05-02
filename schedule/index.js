// Task scheduler
import fs from "fs";
import { networkCron } from "../network/cron.js"
import { temperatureCron } from "../temperature/cron.js"
import { checkForUpdate, updateNow } from "../update/index.js";
import { automationEngine } from "../automations/index.js"

export const taskScheduler = () => {
    automationEngine();

    setInterval(() => {
        const manifest = JSON.parse(fs.readFileSync("manifest.json"));
        if (manifest["network"]["enabled"]) {
            networkCron();
        }
    }, 60000)

    setInterval(() => {
        const manifest = JSON.parse(fs.readFileSync("manifest.json"));
        if (manifest["temperature"]["enabled"]) {
            temperatureCron(true);
        }
    }, 45000)

    setInterval(async () => {
        const check = await checkForUpdate();
        if (check.update) {
            updateNow();
            setTimeout(() => {
                process.exit(0)
            }, 3000)
        }
    }, 4 * 60 * 60 * 1000);
}
