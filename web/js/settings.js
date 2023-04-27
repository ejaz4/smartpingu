const hs = `${window.location.protocol}//${window.location.hostname}`;

(async () => {
    const updateAvailableReq = await fetch(`${hs}:3000/update/check`);
    if (updateAvailableReq.status == 200) {
        const updateDetails = await updateAvailableReq.json();

        if (updateDetails.update) {
            document.getElementById("updateNotifBlob").classList.remove("hidden")
        }
    }
})()

function getAnchor() {
    var currentUrl = document.URL,
        urlParts = currentUrl.split('#');

    return (urlParts.length > 1) ? urlParts[1] : null;
}

if (getAnchor() == null) {
    window.location.replace('#setup');
    scrollTo({
        top: 0,
        left: 0
    })
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

    const finish = await fetch(`${hs}:3000/settings`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "session-id": sessionID
        }
    });

    if (finish.status == 200) {
        window.location.replace("#setup")
        return;
    } else {
        alert("Something went wrong, please try again later.");
    }
}


(async () => {
    if (window.location.pathname == "/settings.html") {
        const settingsFetch = await fetch(`${hs}:3000/settings`);

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