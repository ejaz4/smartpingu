import fs from 'fs';
import { sound } from '../sounds/index.js';
import fetch from 'node-fetch';
import { checkForUpdate } from '../update/index.js';
import { addEvent } from '../logging/events.js';

var automations = {};
var triggerProperties = {};
var actions = {};

export const automationEngine = () => {
    const triggers = JSON.parse(fs.readFileSync("automations/triggers.json"));

    for (const trigger of triggers) {
        automations[trigger.id] = [];
        triggerProperties[trigger.id] = {
            ...trigger
        }
    }

    const flowFile = JSON.parse(fs.readFileSync("automations.json"));

    for (const flowKey of Object.keys(flowFile)) {
        const flow = flowFile[flowKey];

        automations[flow.trigger].push(flow.steps);
    }

    const actionFile = JSON.parse(fs.readFileSync("automations/actions.json"));

    for (const categories of Object.keys(actionFile)) {
        const cat = actionFile[categories]
        for (const action of cat) {
            actions[action.id] = {
                ...action,
                category: categories
            }
        }
    }

    // console.log(actions);

    triggerAutomation("temperatureHigh", [24, 10])
}

export const triggerAutomation = (automationID, args) => {
    if (!Object.keys(automations).includes(automationID)) {
        return false;
    }

    const flows = automations[automationID];

    const requiredArgs = triggerProperties[automationID].arguments;

    var variables = {};

    for (const item of requiredArgs) {
        variables[`_global+${item}`] = args[requiredArgs.indexOf(item)]
    }

    for (const flow of flows) {
        runFlow(flow, automationID, variables);
    }
}

const timer = ms => new Promise(res => setTimeout(res, ms))

const runFlow = async (steps, automationID, variables) => {
    var hotVars = variables;

    var index = 0;

    for (const step of steps) {
        var RequiredArgs = actions[step.step].arguments;

        const stepArgs = step.arguments;
        var args = [];

        for (const arg of stepArgs) {
            if (arg.startsWith("_")) {
                args.push(hotVars[arg]);
            } else {
                args.push(arg);
            }
        }


        // Steps

        // hidden
        if (step.step == "consoleLog") {
            console.log(args[0]);
        }

        // Sound
        if (step.step == "playSound") {
            sound(args[0]);
        }

        // Connectivity
        if (step.step == "sendGETRequest") {
            const request = await fetch(args[0]);
            const requestText = await request.text();

            hotVars[`_${step.id}+Response`] = requestText;
        }

        // Maintenance
        if (step.step == "checkForUpdates") {
            hotVars[`_${step.id}+Update Available`] = (await checkForUpdate()).update;
        }

        if (step.step == "forceLogout") {
            fs.rmSync("auth.lock");
        }

        if (step.step == "logEvent") {
            addEvent({
                type: "Automations",
                title: args[0],
                description: args[1],
                trigger: "Automations"
            })
        }

        if (step.step == "lastEvent") {
            const eventsFile = JSON.parse(fs.readFileSync("events.json"));

            const event = eventsFile[0];

            hotVars[`_${step.id}+Title`] = event.title;
            hotVars[`_${step.id}+Description`] = event.description;
            hotVars[`_${step.id}+Trigger`] = event.trigger;
            hotVars[`_${step.id}+Type`] = event.type;
            hotVars[`_${step.id}+time`] = event.timestamp;

        }

        if (step.step == "getVersions") {
            const manifest = JSON.parse(fs.readFileSync("manifest.json"));

            hotVars[`_${step.id}+Manifest Version`] = manifest.version;
        }


        await timer(2000)
    }

    // console.log(hotVars);
}