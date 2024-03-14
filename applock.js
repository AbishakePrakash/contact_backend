

function applock(password) {
    const d = new Date();
    const hour = d.getHours()
    const minutes = d.getMinutes()

    const time = parseInt(hour.toString() + minutes.toString())

    if (password === time) {
        console.log("Access Granted");
    } else {
        console.log("Access Denied");
    }

}

applock(1738);