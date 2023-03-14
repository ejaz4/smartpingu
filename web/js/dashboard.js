const hostname = `${window.location.protocol}//${window.location.hostname}`;


const main = async() => {
    const infoFetch = await fetch(`${hostname}:3000/info`)
    if (infoFetch.status === 200) {
        const info = await infoFetch.json();
        document.getElementById("deviceName").innerText = info.deviceName;

        const recentsFetch = await fetch(`${hostname}:3000/events`);

        if (recentsFetch.status == 200) {
            const recents = await recentsFetch.json();
            const table = document.getElementById("recent-events")
            
            recents.forEach((recItem, index) => {
                const recentsElement = document.createElement("div");
                recentsElement.classList.add("row");

                const type = document.createElement("div");
                type.classList.add("cell");
                type.innerText = recItem.type;

                const title = document.createElement("div");
                title.classList.add("cell");
                title.innerText = recItem.title;

                const description = document.createElement("div");
                description.classList.add("cell");
                description.innerText = recItem.description

                recentsElement.appendChild(type)
                recentsElement.appendChild(title)
                recentsElement.appendChild(description)

                table.appendChild(recentsElement)
            })
        }

        if (info.network) {
            const devices = await fetch(`${hostname}:3000/network/listDevices`)

            if (devices.status === 200) {
                const devicesJson = await devices.json();
                const devicesList = document.getElementById("devicesList");
                devicesJson.forEach((device) => {
                    const deviceElement = document.createElement("div");
                    deviceElement.classList.add("row");

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

                    const timeCell = document.createElement("div");
                    timeCell.classList.add("cell");
                    timeCell.innerText = formattedTime;


                    deviceElement.appendChild(nameCell);
                    deviceElement.appendChild(ipCell);
                    deviceElement.appendChild(macCell);
                    deviceElement.appendChild(vendorCell);
                    deviceElement.appendChild(timeCell);

                    document.getElementById("nearbyDevicesTable").appendChild(deviceElement);
                });


                document.getElementById("network").innerText = devicesJson.length;
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