import { app } from "../app.js";
import fs from "fs";

export const manipulationRoutes = () => {
    if (!fs.existsSync("proposedTemperature")) {
        fs.writeFileSync("proposedTemperature", "0", {
            flag: "w+"
        })
    }
    if (!fs.existsSync("proposedNetwork.json")) {
        fs.writeFileSync("proposedNetwork.json", "[]", {
            flag: "w+"
        })
    }

    app.get("/network/devices", async (req, res) => {
        const devices = JSON.parse(fs.readFileSync("proposedNetwork.json"));

        res.send(devices);
    });

    app.post("/network/devices/new", async (req, res) => {
        const device = JSON.parse(req.body)[0];

        const proposedFile = JSON.parse(fs.readFileSync("proposedNetwork.json"));

        proposedFile.push(device);

        fs.writeFileSync("proposedNetwork.json", JSON.stringify(proposedFile), {
            flag: "w+"
        })

        res.send({
            status: "success"
        })
    })

    app.post("/network/devices/remove", async(req, res) => {
        const device = JSON.parse(req.body)[0];

        const proposedFile = JSON.parse(fs.readFileSync("proposedNetwork.json"));

        var newVar = [];
        
        for (const devices of proposedFile) {
            console.log(devices.mac == device.mac)
            if (devices.mac == device.mac) {
                
            } else {
                newVar.push(devices)
            }
        }

        console.log(newVar);

        fs.writeFileSync("proposedNetwork.json", JSON.stringify(newVar), {
            flag: "w+"
        })
    })

    app.get("/temperature", async (req, res) => {
        const newTemperatureOffset = fs.readFileSync("proposedTemperature").toString();

        res.send({
            offset: newTemperatureOffset
        })
    })

    app.post("/temperature", async (req, res) => {
        const newTemperatureOffset = JSON.parse(req.body).offset;


        if (Math.abs(newTemperatureOffset) > 2) {
            res.status(400).send({
                message: "Offset too large"
            });
            return;
        }

        fs.writeFileSync("proposedTemperature", newTemperatureOffset, {
            flag: "w+"
        });

        res.send({
            status: "success"
        })
    })
}