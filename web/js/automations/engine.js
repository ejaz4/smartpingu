const hostname = `${window.location.protocol}//${window.location.hostname}`;

const flowID = atob(new URL(document.location).searchParams.get("flowID"));

var actions = {};
var triggerProperties = {};


var flowHotState = {};

function addAction(id) {
    flowHotState.steps.push({
        id: btoa(Math.random() * 100),
        step: id,
        arguments: []
    });
    document.getElementById("flowList").innerHTML = "";

    loadFlow(true);

    window.location.href = "#addButton";
}

function deleteAction(step) {
    var temporarySteps = []
    flowHotState.steps.forEach((item, index) => {

        if (item.id == step) {
            return;
        }
        temporarySteps.push(item);
    });

    flowHotState.steps = temporarySteps;

    document.getElementById("flowList").innerHTML = "";
    loadFlow(true);
}

const createStepTemplate = (step) => {
    const stepProperties = actions[step.step];

    console.log(stepProperties);
    // <div class="flowItem">
    //     <h3>Play sound <div class="argument">File Name</div>
    //     </h3>

    //     <div class="variables">
    //         <div>
    //             <p>File Name</p><input type="text" />
    //         </div>
    //     </div>

    //     <div class="floatingButton">
    //         <div class="btn">
    //             <img src="/images/trash-2.svg" alt="" srcset="">
    //         </div>
    //     </div>
    // </div>

    const stepDiv = document.createElement("div");
    stepDiv.classList.add("flowItem");

    const stepText = document.createElement("h3");
    stepText.innerText = stepProperties.humanReadable;
    stepDiv.appendChild(stepText)

    console.log(stepProperties.arguments.in.length)
    if (stepProperties.arguments.in.length != 0) {
        const inVars = document.createElement("div");
        inVars.classList.add("variables");

        for (const inVariable of stepProperties.arguments.in) {
            const varContainer = document.createElement("div")

            const varName = document.createElement("p");
            varName.innerText = inVariable;

            const field = document.createElement("input");
            field.type = "text";
            field.value = step.arguments[stepProperties.arguments.in.indexOf(inVariable)];
            field.addEventListener("change", (e) => {
                const steps = flowHotState.steps;
                steps.forEach((item, index) => {
                    if (item.id == step.id) {
                        flowHotState.steps[index].arguments[stepProperties.arguments.in.indexOf(inVariable)] = field.value;
                    }
                })
            })

            varContainer.appendChild(varName)
            varContainer.appendChild(field)

            inVars.appendChild(varContainer)
        }

        stepDiv.appendChild(inVars);
    }

    if (stepProperties.arguments.out.length != 0) {
        const variableBar = document.createElement("div");
        variableBar.classList.add("variableBar");

        for (const prop of stepProperties.arguments.out) {
            const propVar = document.createElement("div")

            const varHR = document.createElement("div");
            varHR.classList.add("argument")
            varHR.innerText = prop;

            const varCD = document.createElement("div")
            varCD.innerText = `_${step.id}+${prop}`;

            propVar.appendChild(varHR)
            propVar.appendChild(varCD)

            variableBar.appendChild(propVar)
        }

        stepDiv.append(variableBar)
    }

    const floatingButton = document.createElement("div");
    floatingButton.classList.add("floatingButton");

    const deleteButton = document.createElement("div");
    deleteButton.classList.add("btn");
    const deleteImg = document.createElement("img");
    deleteImg.src = "/images/trash-2.svg"
    deleteButton.appendChild(deleteImg);
    deleteButton.addEventListener("click", (e) => {
        deleteAction(step.id);
    })

    floatingButton.appendChild(deleteButton)

    stepDiv.appendChild(floatingButton);

    document.getElementById("flowList").appendChild(stepDiv)

}

var offset = 0;
const addDots = () => {
    const container = document.createElement("div");
    container.classList.add("dots");
    container.innerHTML = `
    <div class="dot" style="animation-delay: ${offset}s"></div>
    <div class="dot" style="animation-delay: ${offset + 0.1}s"></div>
    <div class="dot" style="animation-delay: ${offset + 0.2}s"></div>
    <div class="dot" style="animation-delay: ${offset + 0.3}s"></div>
    `

    offset += (0.1 + 0.2 + 0.3)
    document.getElementById("flowList").appendChild(container)
}

const createTriggerTemplate = (trigger) => {
    const triggerProps = triggerProperties[trigger];

    const stepDiv = document.createElement("div");
    stepDiv.classList.add("flowItem");

    const triggerText = document.createElement("h3");
    triggerText.innerText = `When ${triggerProps.humanReadable}`;
    stepDiv.appendChild(triggerText)

    const variableBar = document.createElement("div");
    variableBar.classList.add("variableBar");

    for (const prop of triggerProps.arguments) {
        const propVar = document.createElement("div")

        const varHR = document.createElement("div");
        varHR.classList.add("argument")
        varHR.innerText = prop;

        const varCD = document.createElement("div")
        varCD.innerText = `_global+${prop}`;

        propVar.appendChild(varHR)
        propVar.appendChild(varCD)

        variableBar.appendChild(propVar)
    }

    stepDiv.append(variableBar)

    document.getElementById("flowList").appendChild(stepDiv)
}

const loadFlow = async (hot = false) => {
    var flowInformation = flowHotState

    if (!hot) {
        var flowReq = await fetch(`${hostname}:3000/automations/flows/${flowID}`);
        flowInformation = await flowReq.json();
        flowHotState = flowInformation
    }

    createTriggerTemplate(flowInformation.trigger);
    addDots();

    for (const step of flowInformation.steps) {
        createStepTemplate(step);
        addDots();
    }

    if (flowHotState.steps.length == 0) {
        document.getElementById("saveBtn").innerText = "Delete Flow"
    } else {
        document.getElementById("saveBtn").innerText = "Save"
    }
}

const loadEditor = async () => {
    const actionsReq = await fetch(`${hostname}:3000/automations/editor/actions`);
    const actionsRaw = await actionsReq.json()

    for (const categories of Object.keys(actionsRaw)) {
        const catDivHeader = document.createElement("div");
        const p = document.createElement("p");
        p.innerText = categories;
        catDivHeader.appendChild(p);
        catDivHeader.addEventListener("click", (e) => {
            document.getElementById("categories").classList.add("hidden")
            document.getElementById(categories).classList.remove("hidden")
        })
        document.getElementById("categories").appendChild(catDivHeader)


        const categoryScreen = document.createElement("div")
        categoryScreen.id = categories;
        categoryScreen.classList.add("addScreen");
        categoryScreen.classList.add("hidden");

        // <div>
        //     <a href="/automations/automations.html" class="backButton"><img src="/images/chevron-left.svg" />Back</a>
        // </div>

        const backButton = document.createElement("div");
        backButton.classList.add("backButton");
        backButton.innerHTML = `<img src="/images/chevron-left.svg" />Back`
        backButton.addEventListener("click", (e) => {
            document.getElementById("categories").classList.remove("hidden")
            document.getElementById(categories).classList.add("hidden")
        })

        categoryScreen.appendChild(backButton);


        const cat = actionsRaw[categories]
        for (const action of cat) {
            const acDiv = document.createElement("div");
            acDiv.classList.add("actionItem");

            acDiv.addEventListener("click", (e) => {
                addAction(action.id);
            })

            const acHR = document.createElement("h3");
            acHR.innerText = action.humanReadable;

            const acVAR = document.createElement("p");
            acVAR.innerText = `+${(action.arguments.in.length + action.arguments.out.length)} more`


            acDiv.appendChild(acHR);
            acDiv.appendChild(acVAR)

            categoryScreen.appendChild(acDiv)

            actions[action.id] = {
                ...action,
                category: categories
            }
        }

        document.getElementById("addItem").appendChild(categoryScreen)
    }

    const triggersReq = await fetch(`${hostname}:3000/automations/editor/triggers`)
    const triggersRaw = await triggersReq.json();

    for (const trigger of triggersRaw) {
        triggerProperties[trigger.id] = {
            ...trigger
        }
    }

    loadFlow();
}

function saveFlow() {
    const ls = window.localStorage;

    if (!authenticated) {
        var w = window.open(`/authenticate.html?flow=${encodeURIComponent(btoa(`${hostname}/tests/settingsauthwork.html`))}`, undefined, "popup,width=400,height=600")
        var timer = setInterval(function () {
            if (w.closed) {
                clearInterval(timer);
                (async () => {
                    if (!w.closed) {
                        return;
                    }
                    const ls = window.localStorage
                    const verifyFetch = await fetch(`${hostname}:3000/verify`, {
                        method: 'post',
                        body: JSON.stringify({
                            sessionID: ls.getItem("session")
                        })
                    })

                    if (verifyFetch) {
                        if (verifyFetch.status == 200) {
                            authenticated = true;
                            saveFlow();
                        } else {
                            alert("Sorry! That didn't work.\nTry again later.")
                        }
                    }
                })()
            }
        }, 1000);
    } else {
        if (flowHotState.steps.length == 0) {
            const deleteFlow = confirm(`Are you sure you want to delete the flow "${flowID}".\n\nWARNING: This action is irreversible.`);

            if (confirm) {
                fetch(`${hostname}:3000/automations/flows/${flowID}/delete`, {
                    headers: {
                        "session-id": ls.getItem("session")
                    }
                }).then((res) => {
                    if (res.status == 200) {
                        window.location.replace("/automations/automations.html");
                    } else {
                        alert("Sorry! That didn't work.")
                    }
                })
            }
        } else {
            fetch(`${hostname}:3000/automations/flows/${flowID}`, {
                method: "POST",
                body: JSON.stringify(flowHotState),
                headers: {
                    "session-id": ls.getItem("session")
                }
            }).then((res) => {
                if (res.status == 200) {
                    alert("Success")
                } else {
                    alert("Sorry! That didn't work.")
                }
            })
        }
    }
}

loadEditor();