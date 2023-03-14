// Task scheduler
import fs from "fs";
import { networkCron } from "../network/cron.js"

export const taskScheduler = () => {
    setInterval(() => {
        const manifest = JSON.parse(fs.readFileSync("manifest.json"));
        if (manifest["network"]["enabled"]) {
            networkCron();
        }
    }, 60000)
}