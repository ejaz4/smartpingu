import fs from 'fs';
import { checkForUpdate, updateNow } from '../update/index.js';

export const startUp = () => {
    console.log("Starting up Smart Pingu...")

    const manifestStatus = fs.existsSync('manifest.json');

    if (!manifestStatus) {
        setup();
    }

    const manifest = JSON.parse(fs.readFileSync('manifest.json'));

    if (!Object.keys(manifest).includes("sounds")) {
        manifest["sounds"] = {
            "warningChime": true,
            "speech": true,
            "shorterChime": false
        }
    }



    fs.writeFileSync("manifest.json", JSON.stringify(manifest), {
        flag: "w+"
    })
}


const setup = async () => {
    console.log("Setting up Smart Pingu for first-time use...");
    fs.copyFileSync("example.manifest.json", "manifest.json");

    fs.writeFileSync("events.json", JSON.stringify([]), { flag: 'w+' })
    fs.writeFileSync("network.json", JSON.stringify([]), { flag: 'w+' })
    fs.writeFileSync("tempHumid.json", JSON.stringify({}), { flag: 'w+' })

    const check = await checkForUpdate();
    if (check.update) {
        await updateNow();
        setTimeout(() => {
            process.exit(0)
        }, 3000)
    }
};