const status = document.getElementById('status');
const hostname = `${window.location.protocol}//${window.location.hostname}`;

fetch(`${hostname}:3000/info`).then(res => {
    res.json().then((data) => {
        if (data["setup"] == false) {
            window.location.replace("/setup.html");
            return;
        }
        if (data["oobe"] == false) {
            window.location.replace("/oobe.html?reason=not_completed");
            return;
        }
        if (data["soundTest"] == false) {
            window.location.replace("/tests/sound.html");
            return;
        }
        window.location.replace("/dashboard.html");
    })
})