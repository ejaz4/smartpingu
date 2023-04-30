import { app } from "../app.js";
import fs from "fs";

export const manipulationRoutes = () => {
    app.get("/network/devices", async (req, res) => {
        const devices = JSON.parse(fs.readFileSync("proposedNetwork.json"));

        res.send(devices);
    })

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

    app.get("/temperature", async (req, res) => {
        const newTemperatureOffset = fs.readFileSync("proposedTemperature");

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