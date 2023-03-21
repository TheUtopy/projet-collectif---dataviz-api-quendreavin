const getWeather = async (url) => {
    const response = await fetch(url);

    if (response.status != 200) {
        throw new Error("Cannot fetch the data.");
    }

    const data = await response.json();
    return data;
}

getWeather("https://api.open-meteo.com/v1/meteofrance?latitude=47.22&longitude=-1.55&hourly=temperature_2m,precipitation,weathercode&daily=sunrise,sunset&timezone=Europe%2FBerlin")
    .then(data => {
        console.log(data)
    })
    .catch(err => console.log("rejected\n", err.message))
    



















//function timer() {
    
    let heure = new Date();
    let hours = heure.getHours() + ":" + heure.getMinutes();
    //document.getElementById("hours")
    console.log(hours);

//}

//timer()











