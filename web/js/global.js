const uri = document.URL;
var authenticated = false;

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours';
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed / msPerDay) + ' days';
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months';
    }

    else {
        return 'approximately ' + Math.round(elapsed / msPerYear) + ' years';
    }
}

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


async function verify() {
    const ls = window.localStorage
    const verifyFetch = await fetch(`${window.location.protocol}//${window.location.hostname}:3000/verify`, {
        method: 'post',
        body: JSON.stringify({
            sessionID: ls.getItem("session")
        })
    })

    if (verifyFetch) {
        try {
            document.getElementsByClassName("checkingCredentials")[0].classList.add("hidden")
        } catch (err) { }

        if (verifyFetch.status == 200) {
            authenticated = true;
            try {
                document.getElementsByClassName("authenticated")[0].classList.remove("hidden")
            } catch (err) { }
        } else {
            try {
                document.getElementsByClassName("notAuthenticated")[0].classList.remove("hidden")
            } catch (err) { }
        }
    }
}

verify();