import { fork } from "child_process";
import kill from "kill-port";

let proc;

const start = () => {
    if (proc) proc.kill();

    Promise.allSettled([kill(80, "tcp"), kill(3000, "tcp")]).then((e) => {
        proc = fork("index.js");
    
        proc.on("exit", () => {
            start();
        })
    })
}

start();