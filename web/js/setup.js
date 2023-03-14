const hostname = `${window.location.protocol}//${window.location.hostname}`;

fetch(`${hostname}:3000/info`).then(res => {
    res.json().then((data) => {
        document.getElementById("deviceName").value = data.deviceName;
    })
})

document.getElementById("submitButton").addEventListener("click", async (e) => {
    const submitBtn = document.getElementById("submitButton");
    const text = document.getElementById("submitButtonText");
    const icon = document.getElementById("submitButtonLoading");

    if (!(checkPassword()).allowed) {
        alert((checkPassword()).reason)
        return;
    }

    text.classList.add("hidden");
    icon.classList.remove("hidden");

    const changePassword = await fetch(`${hostname}:3000/auth/password`, {
        method: "POST",
        body: JSON.stringify({
            proposed: document.getElementById("password").value,
            password: null
        })
    });

    if (changePassword.status != 200) {
        window.location.href = "/error.html?error=password-already-set"
        return;
    }

    const login = await fetch(`${hostname}:3000/authenticate`, {
        method: "POST",
        body: JSON.stringify({
            password: document.getElementById("password").value
        })
    })

    if (login.status != 200) {
        window.location.href = "/error.html?error=login-failed"
        return;
    }

    const sessionID = await login.json();

    var ls = window.localStorage;

    ls.setItem("session", sessionID.sessionID);

    const changeDeviceName = await fetch(`${hostname}:3000/settings`, {
        method: "POST",
        body: JSON.stringify({
            deviceName: document.getElementById("deviceName").value,
            setup: true
        }),
        headers: {
            "session-id": sessionID.sessionID
        }
    });

    if (changeDeviceName.status == 200) {
        window.location.replace("/")
        return;
    }
})

function checkPassword() {
    const password = document.getElementById("password").value
    const repeatedPassword = document.getElementById("passwordrepeat").value;

    if (password.length < 7) {
        return {
            allowed: false,
            reason: "Password must be at least 8 characters long"
        }
    }
    if (password != repeatedPassword) {
        return {
            allowed: false,
            reason: "Passwords do not match"
        }
    }
    return {
        allowed: true
    }
}