const hostname = `${window.location.protocol}//${window.location.hostname}`;


const main = async () => {
    const infoFetch = await fetch(`${hostname}:3000/info`)
    if (infoFetch.status === 200) {
        const info = await infoFetch.json();
        document.getElementById("deviceName").innerText = info.deviceName;

        const recentsFetch = await fetch(`${hostname}:3000/events`);

        if (recentsFetch.status == 200) {
            const recents = await recentsFetch.json();
            const table = document.getElementById("recent-events");

            recents.forEach((recItem, index) => {
                var oneHourWindow = Date.now() - (60 * 60 * 1000);

                if (oneHourWindow < recItem.timestamp) {
                    const recentsElement = document.createElement("div");
                    recentsElement.classList.add("recents");

                    const title = document.createElement("h3");
                    title.innerText = `${recItem.title} • ${recItem.type}`;

                    const description = document.createElement("p");
                    // description.classList.add("cell");
                    description.innerText = recItem.description

                    const time = document.createElement("p");
                    // description.classList.add("cell");
                    const rID = btoa(Math.random());
                    time.innerText = `${timeDifference(Date.now(), recItem.timestamp)} ago`
                    time.id = rID;

                    setInterval(() => {
                        document.getElementById(rID).innerText = `${timeDifference(Date.now(), recItem.timestamp)} ago`
                    }, 400)

                    // recentsElement.appendChild(type)
                    recentsElement.appendChild(title)
                    recentsElement.appendChild(description)
                    recentsElement.appendChild(time)

                    table.appendChild(recentsElement)
                }
            })
        }

        if (info.temperature) {
            const temperature = await fetch(`${hostname}:3000/temperature/now`);

            if (temperature.status == 200) {
                const temperatureJson = await temperature.json();

                const temp = temperatureJson.temperature;

                document.getElementById("temperature").innerText = `${Math.round(temp)}°C`;

                document.getElementById("temperature").addEventListener("click", async () => {
                    document.getElementById("temperature").classList.add("hidden");
                    document.getElementsByClassName("temperatureLoading")[0].classList.remove("hidden");

                    fetch(`${hostname}:3000/temperature/rescan`).then((res) => {
                        if (res.status == 200) {
                            window.location.reload();
                        }
                    });
                });

                const prediction = await fetch(`${hostname}:3000/temperature/predict`);
                if (prediction.status == 200) {
                    const predictionJSON = await prediction.json()

                    document.getElementById("prediction").innerText = `${Math.round(predictionJSON.point)}°C in ${predictionJSON.time} minutes`
                }
            }
        } else {
            const temperatureItems = document.getElementsByClassName("temperature");

            for (let i = 0; i < temperatureItems.length; i++) {
                temperatureItems[i].classList.add("hidden");
            }
        }

        if (info.humidity) {
            const humidity = await fetch(`${hostname}:3000/temperature/now`);

            if (humidity.status == 200) {
                const humidityJson = await humidity.json();

                const humid = humidityJson.humidity;

                document.getElementById("humidity").innerText = `${Math.floor(humid)}%`;

                document.getElementById("humidity").addEventListener("click", async () => {
                    document.getElementById("humidity").classList.add("hidden");
                    document.getElementsByClassName("humidityLoading")[0].classList.remove("hidden");

                    fetch(`${hostname}:3000/temperature/rescan`).then((res) => {
                        if (res.status == 200) {
                            window.location.reload();
                        }
                    })
                });
            }
        } else {
            const humidityItems = document.getElementsByClassName("humidity");

            for (let i = 0; i < humidityItems.length; i++) {
                humidityItems[i].classList.add("hidden");
            }
        }

        if (info.network) {
            const devices = await fetch(`${hostname}:3000/network/listDevices`)

            if (devices.status === 200) {
                const devicesJson = await devices.json();
                const devicesList = document.getElementById("devicesList");
                devicesJson.forEach((device) => {
                    const deviceElement = document.createElement("div");
                    deviceElement.classList.add("row");

                    const rID = btoa(Math.random());

                    const nameCell = document.createElement("div");
                    nameCell.classList.add("cell");
                    nameCell.innerText = device.name;

                    const ipCell = document.createElement("div");
                    ipCell.classList.add("cell");
                    ipCell.innerText = device.ip;

                    const macCell = document.createElement("div");
                    macCell.classList.add("cell");
                    macCell.innerText = device.mac;

                    const vendorCell = document.createElement("div");
                    vendorCell.classList.add("cell");
                    vendorCell.innerText = (device.vendor[0] == "U") ? "Unknown" : device.vendor[0];

                    const timeCell = document.createElement("div");
                    timeCell.classList.add("cell");
                    timeCell.id = rID
                    timeCell.innerText = ``;

                    setInterval(() => {
                        let unix_timestamp = device.firstSeen
                        var timestampNow = Date.now()
                        // Create a new JavaScript Date object based on the timestamp
                        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                        var date = new Date(timestampNow - unix_timestamp);
                        // Hours part from the timestamp
                        var hours = date.getHours() - 1;
                        // Minutes part from the timestamp
                        var minutes = "0" + date.getMinutes();
                        // Seconds part from the timestamp
                        var seconds = "0" + date.getSeconds();

                        // Will display time in 10:30:23 format
                        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                        document.getElementById(rID).innerText = formattedTime;
                    }, 400);

                    deviceElement.appendChild(nameCell);
                    deviceElement.appendChild(ipCell);
                    deviceElement.appendChild(macCell);
                    deviceElement.appendChild(vendorCell);
                    deviceElement.appendChild(timeCell);

                    document.getElementById("nearbyDevicesTable").appendChild(deviceElement);
                });


                document.getElementById("network").innerText = devicesJson.length;

                document.getElementById("network").addEventListener("click", async () => {
                    document.getElementById("network").classList.add("hidden");
                    document.getElementsByClassName("networkLoading")[0].classList.remove("hidden");

                    fetch(`${hostname}:3000/network/rescan`).then((res) => {
                        if (res.status == 200) {
                            window.location.reload();
                        }
                    })
                });
            }
        } else {
            const networkItems = document.getElementsByClassName("network");

            for (let i = 0; i < networkItems.length; i++) {
                networkItems[i].classList.add("hidden");
            }
        }
    }
}


main();