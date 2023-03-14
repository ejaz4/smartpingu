var screen = 1;
const hostname = `${window.location.protocol}//${window.location.hostname}`;

function next() {
    const currentScreen = document.getElementsByClassName(`s${screen}`)[0];

    currentScreen.classList.add('hidden');

    screen++;

    const nextScreen = document.getElementsByClassName(`s${screen}`)[0];

    nextScreen.classList.remove('hidden');
}

async function submit() {
    const networkScan = document.getElementById('scan-lan').checked;
    const maxDevices = document.getElementById('max-devices').value;
    const newDeviceNotification = document.getElementById("alert-computers").checked;

    const temperature = document.getElementById('temperature').checked;
    const maxTemperature = document.getElementById("temperatureMax").value;

    const humidity = document.getElementById('humidity').checked;
    const maxHumidity = document.getElementById("humidityMax").value;

    var data = {
        "oobe": true,
        "temperature": {
            "enabled": temperature,
            "max": parseInt(maxTemperature),
            "unit": "C"
        },
        "humidity": {
            "enabled": humidity,
            "max": parseInt(maxHumidity),
            "unit": "%"
        },
        "network": {
            "enabled": networkScan,
            "max": parseInt(maxDevices),
            "newDeviceNotification": newDeviceNotification
        }
    }

    var ls = window.localStorage;

    var sessionID = ls.getItem("session");

    const finish = await fetch(`${hostname}:3000/settings`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "session-id": sessionID
        }
    });
    
    if (finish.status == 200) {
        window.location.replace("/")
        return;
    } else {
        alert("Something went wrong, please try again later.");
    }
}


(async() => {
    if (window.location.pathname == "/settings.html") {
        const settingsFetch = await fetch(`${hostname}:3000/settings`);

        if (settingsFetch.status == 200) {
            const settingsData = await settingsFetch.json();

            document.getElementById("device-name").value = settingsData["deviceName"];

            document.getElementById('scan-lan').checked = settingsData["network"]["enabled"];
            document.getElementById('max-devices').value = settingsData["network"]["max"];
            document.getElementById("alert-computers").checked = settingsData["network"]["newDeviceNotification"];

            document.getElementById('temperature').checked = settingsData["temperature"]["enabled"];
            document.getElementById("temperatureMax").value = settingsData["temperature"]["max"];

            document.getElementById('humidity').checked = settingsData["humidity"]["enabled"];
            document.getElementById("humidityMax").value = settingsData["humidity"]["max"];
        }
    }
})()