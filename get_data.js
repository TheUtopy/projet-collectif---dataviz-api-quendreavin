

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
        truc(data);
    })
    .catch(err => console.log("rejected\n", err.message))
    
function truc(data) {
    console.log(data)
    const hourlyIndex = returnIndexOfDate(data, formatDateAndTime())
    let temperature = data.hourly.temperature_2m[hourlyIndex]
    let precipitation = data.hourly.precipitation[hourlyIndex]
    let weathercode = data.hourly.weathercode[hourlyIndex]
    console.log(weathercode, temperature, precipitation)
    console.log(isItDay(sunrise(data), sunset(data)))
    console.log(whichImageWeathercode(weathercode))

    //affichage de la temperature et de la precipitation
    document.getElementById("temperature").innerHTML = "Il fait " + temperature + "°C"
    document.getElementById("precipitation").innerHTML = "Il est prévu " + precipitation + "mm de pluie"

    
}




// Affichage de l'heure en temps réel dans le HTML

function fcinq(){
    let i = 1000;
    setTimeout('clock()', i)
}

let heureActuelle = new Date;
heureActuelle = heureActuelle.getHours()
//console.log(heureActuelle)

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

    
    document.getElementById("horloge").innerHTML = horloge
    fcinq()
    
    if (heureActuelle != parseInt(hours)){
        heureActuelle = hours
        getWeather("https://api.open-meteo.com/v1/meteofrance?latitude=47.22&longitude=-1.55&hourly=temperature_2m,precipitation,weathercode&daily=sunrise,sunset&timezone=Europe%2FBerlin")
            .then(data => {
                truc(data);
            })
            .catch(err => console.log("rejected\n", err.message))
    }
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

document.getElementById("date").innerHTML = "Aujourd'hui nous sommes le " + timer()[0]

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
    time = [parseInt(time[0]), parseInt(time[1])]
    if (time[0] < sunrise[0] || time[0] > sunset[0]) {
        return false
    } else if (time[0] == sunrise[0] && time[1] < sunrise[1]){
        return false
    } else if (time[0] == sunset[0] && time[1] > sunset[1]) {
        return false
    } else {
        return true
    }
}

// Fonction d'affichage image en fonction du weathercode

function whichImageWeathercode(weathercode){
    let wCode= weathercode
    if (wCode == 0) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/Soleil.png\">"
    } else if ((wCode == 1) || (wCode == 2) || (wCode == 3)){
        return document.querySelector(".image").innerHTML = "<img src=\"images/BeauCouvert.png\">"
    } else if ((wCode == 45) || (wCode == 48)) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/Brumeux.png\">"
    } else if ((wCode == 51) || (wCode == 53) || (wCode == 55)) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/PluieFine.png\">"
    } else if ((wCode == 61) || (wCode == 63) || (wCode == 65)) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/Pluvieux.png\">"
    } else if ((wCode == 66) || (wCode == 67)) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/PluieVerglacante.png\">"
    } else if ((wCode == 71) || (wCode == 73) || (wCode == 75) || (wCode == 85) || (wCode == 86)) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/Neige.png\">"
    } else if ((wCode == 80) || (wCode == 81) || (wCode == 82)) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/AversePluie.png\">"
    } else if ((wCode == 95)) {
        return  document.querySelector(".image").innerHTML = "<img src=\"images/Orageux.png\">"
    } else if ((wCode == 96) || (wCode == 99)){
        return document.querySelector(".image").innerHTML = "<img src=\"images/GrosOrage.png\">"
    }
    }



 