import { app } from '../app.js'
import crypto from 'crypto';
import fs from 'fs';
import { settingsRoutes } from './settings.js'
import { addEvent } from '../logging/events.js'

export const authRoutes = () => {
    app.post('/authenticate', async (req, res) => {
        const password = JSON.parse(req.body).password;
        const manifest = JSON.parse(fs.readFileSync("manifest.json", { encoding: "utf-8" }));

        const verified = await verify(password, manifest["passphrase"]);

        if (verified) {
            const sessionID = crypto.randomBytes(16).toString("hex");
            
            addEvent({
                type: "Login",
                title: "New Login",
                description: `A new device has just logged in to Smart Pingu.`,
                timestamp: Date.now(),
                trigger: "Security"
            })
            
            fs.writeFileSync("auth.lock", sessionID);
            res.status(200).send({
                sessionID: sessionID
            })
        } else {
            res.status(403).send({
                error: "Incorrect password"
            })
        }
    });

    app.post('/verify', async (req, res) => {
        const sessionID = JSON.parse(req.body).sessionID;

        const lockFile = fs.readFileSync("auth.lock");

        if (lockFile == sessionID) {
            res.status(200).send({
                status: "success"
            })
        } else {
            res.status(403).send({
                status: "failed"
            })
        }
    });

    app.post('/auth/password', async (req, res) => {
        var body = JSON.parse(req.body);

        const password = body.password;
        const manifest = JSON.parse(fs.readFileSync("manifest.json", { encoding: "utf-8" }));
        let verified;
        if (manifest["passphrase"] != null) {
            verified = await verify(password, manifest["passphrase"]);
        } else {
            verified = (password == manifest["passphrase"]);
        }

        if (verified) {
            const newPassword = (await hash(body.proposed)).toString();
            manifest["passphrase"] = newPassword;

            addEvent({
                type: "Login",
                title: "New Login",
                description: `A new device has just logged in to Smart Pingu.`,
                timestamp: Date.now(),
                trigger: "Security"
            })

            fs.writeFileSync("manifest.json", JSON.stringify(manifest), { flag: 'w+' });
            res.send({
                status: "success"
            });
        } else {
            res.status(403).send({
                error: "Incorrect password"
            })
        }
    });

    settingsRoutes()
}

export const verifySession = (sessionID) => {
    const actualID = fs.readFileSync("auth.lock");
    return sessionID == actualID;
}

async function hash(password) {
    return new Promise((resolve, reject) => {
        // generate random 16 bytes long salt
        const salt = crypto.randomBytes(16).toString("hex")

        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ":" + derivedKey.toString('hex'))
        });
    })
}

async function verify(password, hash) {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":")
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(key == derivedKey.toString('hex'))
        });
    })
}
