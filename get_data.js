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
        traitementDesDonnées(data);
    })
    .catch(err => console.log("rejected\n", err.message))
    
function traitementDesDonnées(data) {
    console.log(data)
    const hourlyIndex = returnIndexOfDate(data, formatDateAndTime())
    let temperature = data.hourly.temperature_2m[hourlyIndex]
    let precipitation = data.hourly.precipitation[hourlyIndex]
    let weathercode = data.hourly.weathercode[hourlyIndex]
    console.log(weathercode, temperature, precipitation)
    console.log(isItDay(sunrise(data), sunset(data)))
    console.log(whichImageWeathercode(weathercode))

    document.getElementById("date").innerText = "Aujourd'hui nous sommes le " + getDateAndTime()[0]
    //affichage de la temperature et de la precipitation
    document.getElementById("temperature").innerHTML = "Il fait " + temperature + "°C"
    document.getElementById("precipitation").innerHTML = "Il est prévu " + precipitation + "mm de pluie"
}




// Affichage de l'heure en temps réel dans le HTML et actualisation de l'affichage des données de l'API

function tempsDeRaffraichissement(){
    let i = 1000;
    setTimeout('actualisation()', i)
}

let heureActuelle = new Date;
heureActuelle = heureActuelle.getHours()
//console.log(heureActuelle)

function actualisation(){
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
    tempsDeRaffraichissement()
    
    if (heureActuelle != parseInt(hours)){
        heureActuelle = hours
        getWeather("https://api.open-meteo.com/v1/meteofrance?latitude=47.22&longitude=-1.55&hourly=temperature_2m,precipitation,weathercode&daily=sunrise,sunset&timezone=Europe%2FBerlin")
            .then(data => {
                traitementDesDonnées(data);
            })
            .catch(err => console.log("rejected\n", err.message))
    }
}

// Récupère la date et l'heure

function getDateAndTime() {
    let heure = new Date();
    let hours = heure.getHours() + ":" + heure.getMinutes();
    let date = heure.toLocaleDateString('fr');
    return [date, hours]
}

// Mettre date et heure actuelle au format du json
// Il faut aussi arrondir l'heure (floor)

//2023-03-21T00:00

function formatDateAndTime(dateAndTime=getDateAndTime()) {
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

function isItDay(sunrise, sunset, time=getDateAndTime()[1]) {
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
    if (weathercode == 0) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/Soleil.png\">"
    } else if ((weathercode == 1) || (weathercode == 2) || (weathercode == 3)){
        return document.querySelector(".image").innerHTML = "<img src=\"images/BeauCouvert.png\">"
    } else if ((weathercode == 45) || (weathercode == 48)) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/Brumeux.png\">"
    } else if ((weathercode == 51) || (weathercode == 53) || (weathercode == 55)) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/PluieFine.png\">"
    } else if ((weathercode == 61) || (weathercode == 63) || (weathercode == 65)) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/Pluvieux.png\">"
    } else if ((weathercode == 66) || (weathercode == 67)) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/PluieVerglacante.png\">"
    } else if ((weathercode == 71) || (weathercode == 73) || (weathercode == 75) || (weathercode == 85) || (weathercode == 86)) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/Neige.png\">"
    } else if ((weathercode == 80) || (weathercode == 81) || (weathercode == 82)) {
        return document.querySelector(".image").innerHTML = "<img src=\"images/AversePluie.png\">"
    } else if ((weathercode == 95)) {
        return  document.querySelector(".image").innerHTML = "<img src=\"images/Orageux.png\">"
    } else if ((weathercode == 96) || (weathercode == 99)){
        return document.querySelector(".image").innerHTML = "<img src=\"images/GrosOrage.png\">"
    }
}



 