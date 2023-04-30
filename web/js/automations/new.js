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

    const automationReq = await fetch(`${hostname}:3000/automations/editor/triggers`);

    if (automationReq.status != 200) return alert("Sorry! Something went wrong.");

    const automations = await automationReq.json()

    for (const flowName of automations) {


        const div = document.createElement("div");
        div.classList.add("categoryItem");
        div.addEventListener("click", async (e) => {
            if (!authenticated) {
                alert("Authenticate and try that again");
                return window.location.replace(`/authenticate.html?flow=${encodeURIComponent(btoa(window.location))}`);
            }
            let foo = prompt('Enter a name for your flow');
            if (foo == null) return;

            const ls = window.localStorage;

            const newFlowReq = await fetch(`${hostname}:3000/automations/flows/${foo}`, {
                method: 'POST',
                body: JSON.stringify({
                    trigger: flowName.id,
                    steps: []
                }),
                headers: {
                    "session-id": ls.getItem("session")
                }
            })

            if (newFlowReq.status == 200) {
                window.location.href = `/automations/engine.html?flowID=${btoa(foo)}`

            } else {
                alert("Sorry! That didn't work.")
            }
        })


        const lsDiv = document.createElement("div");

        const p = document.createElement("p");
        p.innerText = `When ${flowName.humanReadable}`;

        const img = document.createElement("img");
        img.src = "/images/chevron-right.svg";

        lsDiv.appendChild(p);
        div.appendChild(lsDiv)
        div.appendChild(img)

        document.getElementById("triggerList").appendChild(div);
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
    window.location.replace('#triggerList');
    scrollTo({
        top: 0,
        left: 0
    })
}