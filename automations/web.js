import { app } from "../app.js";
import fs from "fs";
import { verifySession } from "../auth/index.js";

export const automationRoutes = () => {
    app.get("/automations/flows", (req, res) => {
        const flowFile = JSON.parse(fs.readFileSync("automations.json"));

        res.send(Object.keys(flowFile));
    });

    app.get("/automations/flows/:flowID", (req, res) => {
        const flowFile = JSON.parse(fs.readFileSync("automations.json"));

        res.send(flowFile[req.params.flowID])
    })

    app.get("/automations/editor/actions", (req, res) => {
        const actions = JSON.parse(fs.readFileSync("automations/actions.json"));

        res.send(actions);
    })

    app.get("/automations/editor/triggers", (req, res) => {
        const triggers = JSON.parse(fs.readFileSync("automations/triggers.json"));

        res.send(triggers);
    })

    app.post("/automations/flows/:flowID", (req, res) => {

        const sessionID = verifySession(req.headers['session-id']);


        if (!sessionID) {
            res.status(403).send({
                status: "error",
                message: "No session ID provided"
            });
        }

        if (sessionID) {
            const flowFile = JSON.parse(fs.readFileSync("automations.json"));
            const proposedFlowFile = JSON.parse(req.body);
            const flowID = req.params.flowID;

            flowFile[flowID] = proposedFlowFile;

            fs.writeFileSync("automations.json", JSON.stringify(flowFile), { flag: "w+" });
            res.send({
                status: "success"
            })
        }
    })
}