import fetch from 'node-fetch'
import { exec, execSync } from 'child_process'

var currentCommit = "";

export const checkForUpdate = async () => {
    const req = await fetch('https://api.github.com/repos/ejaz4/smartpingu/commits/main');
    if (req.status == 200) {
        const reqJSON = await req.json();
        const latestCommit = reqJSON.sha;

        currentCommit = execSync('git rev-parse HEAD').toString().trim();

        if (latestCommit != currentCommit) {
            console.log('Update available!');
            const message = "Cumulative Update";
            if (reqJSON.commit.message) message = reqJSON.commit.message;

            return {
                update: true,
                message: message,
            }
        } else {
            console.log('The system is up to date.');
            
            return {
                update: false,
                message: null
            }
        }
    }
}

export const updateNow = async() => {
    execSync('git pull origin main');

    const newCommit = execSync('git rev-parse HEAD').toString().trim();

    if (newCommit != currentCommit) {
        console.log('Updated successfully!');
        console.log('Restarting...');

        return true;
    }
}