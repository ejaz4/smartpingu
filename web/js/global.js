const uri = document.URL;
var authenticated = false;

try {
    document.getElementById("authenticateNowButton").addEventListener("click", (e) => {
        const hostname = `${window.location.protocol}//${window.location.hostname}`;
        window.location.href = `${hostname}/authenticate.html?flow=${encodeURIComponent(btoa(uri))}`
    });

    document.getElementById("signOutBtn").addEventListener("click", (e) => {
        const ls = window.localStorage;

        ls.removeItem("session");

        window.location.reload();
    })
} catch (err) { }


const ls = window.localStorage
fetch(`${window.location.protocol}//${window.location.hostname}:3000/verify`, {
    method: 'post',
    body: JSON.stringify({
        sessionID: ls.getItem("session")
    })
}).then((res) => {
    try {
        document.getElementsByClassName("checkingCredentials")[0].classList.add("hidden")
    } catch (err) { }

    if (res.status == 200) {
        authenticated = true;
        try {
            document.getElementsByClassName("authenticated")[0].classList.remove("hidden")
        } catch (err) { }
    } else {
        try {
            document.getElementsByClassName("notAuthenticated")[0].classList.remove("hidden")
        } catch (err) { }
    }
})