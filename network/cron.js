import fs from 'fs';
import find from 'local-devices';
import oui from 'oui';
import { addEvent } from '../logging/events.js';
import { sound } from '../sounds/index.js'

export const networkCron = async() => {
    if (fs.existsSync("network.json")) {
        const networkDevices = JSON.parse(fs.readFileSync("network.json"));

        const currentDevices = await find();
        
        var currentlyJoinedDevices = [];
        var anyNew = false;

        for (const device of currentDevices) {
            var found = false;
            var foundAt = 0;
            networkDevices.forEach((reg, index) => {
                console.log(`${device.mac} ${reg.mac}` , device.mac == reg.mac);
                if (device.mac == reg.mac) {
                    found = true;
                    anyNew = true;
                    foundAt = index;
                }
            })

            if (!found) {
                const vendor = await oui(device.mac)

                const newDevice = {
                    ...device,
                    firstSeen: Date.now(),
                    vendor: vendor ? vendor.split("\n") : "Unknown"
                }

                addEvent({
                    type: "Network",
                    title: "New Device",
                    description: `A new device has been detected on the network. The device is a ${newDevice.vendor[0]} and has the IP address ${newDevice.ip}.`,
                    timestamp: Date.now(),
                    trigger: "CRON"
                })

                console.log(newDevice);

                currentlyJoinedDevices.push(newDevice);
            } else {
                const obj = networkDevices[foundAt];
                
                
                currentlyJoinedDevices.push(obj);
            }
        }

        if (anyNew) {
            const manifest = JSON.parse(fs.readFileSync("manifest.json"));

            if (manifest["network"]["newDeviceNotification"]) {
                sound('sounds/deviceconnected.mp3');
            }

            if (currentlyJoinedDevices.length > manifest["network"]["max"]) {
                if (!fs.existsSync("networkLimit.lock")) {
                    sound('sounds/loadsofdevices.mp3');
                    addEvent({
                        type: "Network",
                        title: "High capacity",
                        description: `The number of devices has gone above your set limit.`,
                        timestamp: Date.now(),
                        trigger: "Limiter"
                    })
                    fs.writeFileSync("networkLimit.lock", "");
                }
            } else {
                if (fs.existsSync("networkLimit.lock")) {
                    fs.rmSync("networkLimit.lock");
                }
            }
        }

        fs.writeFileSync("network.json", JSON.stringify(currentlyJoinedDevices), {
            encoding: "utf8",
            flag: "w+"
        });

        return networkDevices;
    } else {
        const currentDevices = await find()
        const networkDevices = [];

        for (const device of currentDevices) {
            const vendor = await oui(device.mac)

            const newDevice = {
                ...device,
                firstSeen: Date.now(),
                vendor: vendor ? vendor.split("\n") : "Unknown"
            }

            networkDevices.push(newDevice);
        }

        fs.writeFileSync("network.json", JSON.stringify(networkDevices), {
            encoding: "utf8",
            flag: "w+"
        });

        return networkDevices;
    }
}