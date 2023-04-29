const hostname = `${window.location.protocol}//${window.location.hostname}`;

const loadAutomations = async () => {
    /* <a href="#nearby">
        <div class="categoryItem">
            <div>
                <img src="/images/wifi.svg" alt="" />
                <p>Nearby Devices</p>
            </div>
            <img src="/images/chevron-right.svg" fill="white" />
        </div>
    </a> */

    const automationReq = await fetch(`${hostname}:3000/automations/flows`);

    if (automationReq.status != 200) return alert("Sorry! Something went wrong.");

    const automations = await automationReq.json()

    for (const flowName of automations) {
        const a = document.createElement("a");
        a.setAttribute("href", `/automations/engine.html?flowID=${btoa(flowName)}`)

        const div = document.createElement("div");
        div.classList.add("categoryItem");


        const lsDiv = document.createElement("div");

        const p = document.createElement("p");
        p.innerText = flowName;

        const img = document.createElement("img");
        img.src = "/images/chevron-right.svg";

        lsDiv.appendChild(p);
        div.appendChild(lsDiv)
        div.appendChild(img)

        a.appendChild(div);

        document.getElementById("automationList").appendChild(a);
        console.log("hi");
    }
}

loadAutomations();

function getAnchor() {
    var currentUrl = document.URL,
        urlParts = currentUrl.split('#');

    return (urlParts.length > 1) ? urlParts[1] : null;
}
if (getAnchor() == null) {
    window.location.replace('#automationList');
    scrollTo({
        top: 0,
        left: 0
    })
}