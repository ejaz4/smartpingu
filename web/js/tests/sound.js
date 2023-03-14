const hostname = `${window.location.protocol}//${window.location.hostname}`;

fetch(`${hostname}:3000/tests/sound`);

async function yes() {
    const ls = window.localStorage;

    const sessionID = ls.getItem('session');

    const settingsReq = await fetch(`${hostname}:3000/settings`, {
        method: 'POST',
        body: JSON.stringify({
            soundTest: true
        }),
        headers: {
            'session-id': sessionID
        },
    });

    if (settingsReq.status == 200) {
        window.location.replace("/");
        return;
    }
}