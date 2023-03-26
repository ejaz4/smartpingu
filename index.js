import { fork, execSync } from "child_process";
// import kill from "kill-port";
import * as url from 'url';

let proc;

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

process.chdir(__dirname);
execSync(`git config --global --add safe.directory ${__dirname}`);

const start = () => {
    if (proc) proc.kill();

    proc = fork("app.js");

    proc.on("exit", () => {
        start();
    })
    // Promise.allSettled([kill(80, "tcp"), kill(3000, "tcp")]).then((e) => {
    // })
}

start();