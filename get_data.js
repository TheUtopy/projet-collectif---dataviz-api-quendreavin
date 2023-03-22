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
        const hourlyIndex = returnIndexOfDate(data, formatDateAndTime())
        const temperature = data.hourly.temperature_2m[hourlyIndex]
        const precipitation = data.hourly.precipitation[hourlyIndex]
        const weathercode = data.hourly.weathercode[hourlyIndex]
        console.log(weathercode, temperature, precipitation)
        console.log(isItDay(sunrise(data), sunset(data)))
    })
    .catch(err => console.log("rejected\n", err.message))
    




// Affichage de l'heure en temps réel dans le HTML

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

// Récupère la date et l'heure

function timer() {
    let heure = new Date();
    let hours = heure.getHours() + ":" + heure.getMinutes();
    let date = heure.toLocaleDateString('fr');
    return [date, hours]
}

// Affichage de la date et de l'heure dans le HTML

document.getElementById("time").innerHTML = "Aujourd'hui nous sommes le " + timer()[0]

// Mettre date et heure actuelle au format du json
// Il faut aussi arrondir l'heure (floor)

//2023-03-21T00:00

function formatDateAndTime(dateAndTime=timer()) {
    let date = dateAndTime[0].split("/")
    let time = dateAndTime[1].split(":")
    time = time[0]
    if (parseInt(time) < 10) {
        time = "0" + time
    }
    dateAndTime = date[2] + "-" + date[1] + "-" + date[0] + "T" + time +":00"
    return dateAndTime
} 

// Depuis les datas en json, retourne l'index des datas à l'heure actuelle
// Ce qui permet ensuite d'aller retrouver la température, etc depuis l'index

function returnIndexOfDate(data, currentDateAndTime) {
    return data.hourly.time.indexOf(currentDateAndTime)
}

// Retourne l'heure de levé du soleil et l'heure de couché

function sunrise(data) {
    let temp = data.daily.sunrise[0].split("T")
    temp = temp[1].split(":")
    const hours = parseInt(temp[0])
    const minutes = parseInt(temp[1])

    return [hours, minutes]
}

function sunset(data) {
    let temp = data.daily.sunset[0].split("T")
    temp = temp[1].split(":")
    const hours = parseInt(temp[0])
    const minutes = parseInt(temp[1])

    return [hours, minutes]
}

// Fonction qui retourne si il fait jour ou non

function isItDay(sunrise=sunrise(data), sunset=sunset(data), time=timer()[1]) {
    time = time.split(":")
    
    return time
}




 