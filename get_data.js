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
    






function fcinq(){
    let i = 1000;
    setTimeout('clock()', i)
}

function clock(){
    let heure = new Date
    let hours = heure.getHours();
    let min = heure.getMinutes();
    let sec = heure.getSeconds();

    if (hours < 10){
        hours = "0" + hours
    }
    if (min < 10){
        min = "0" + min
    }
    if (sec < 10){
        sec = "0" + sec
    }
    let horloge = hours + ":" + min + ":" + sec

    
    document.getElementById("temps").innerHTML = horloge
    fcinq()
}
clock()












function timer() {
    let heure = new Date();
    let date = heure.toLocaleDateString('fr');    
    return [date]
}

document.getElementById("time").innerHTML = "Aujourd'hui nous sommes le " + timer()[0]










