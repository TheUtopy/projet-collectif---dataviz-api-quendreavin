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
        isItDay(sunrise(data), sunset(data), getDateAndTime()[1])
    })
    .catch(err => console.log("rejected\n", err.message))


// Fonction qui permet de traiter les données et de les afficher
// Cela permet plus de clarté au dessus

function traitementDesDonnées(data) {
    console.log(data)
    let temperature = data.hourly.temperature_2m[hourlyIndex]
    let precipitation = data.hourly.precipitation[hourlyIndex]
    let weathercode = data.hourly.weathercode[hourlyIndex]

    console.log(weathercode, temperature, precipitation)
    console.log(whichImageWeathercode(weathercode))



    document.getElementById("date").innerText = "Aujourd'hui nous sommes le " + getDateAndTime()[0]
    document.getElementById("lever_du_soleil").innerHTML = "Le soleil se lève à " + sunrise(data)[0] + " " + "heure " + sunrise(data)[1] + " " + "minutes"
    document.getElementById("coucher_du_soleil").innerHTML = "Il se couche à " + sunset(data)[0] + " " + "heure " + sunset(data)[1] + " " + "minutes"
    //affichage de la temperature et de la precipitation

    document.getElementById("temperature").innerHTML = temperature + "°C"
    document.getElementById("precipitation").innerHTML = precipitation + " mm de pluie"

}



// Affichage de l'heure en temps réel dans le HTML et actualisation de l'affichage des données de l'API

function tempsDeRaffraichissement() {
    let i = 1000;
    setTimeout('actualisation()', i)
}

let heureActuelle = new Date;
heureActuelle = heureActuelle.getHours()
//console.log(heureActuelle)

function actualisation() {
    let heure = new Date
    let hours = heure.getHours();
    let min = heure.getMinutes();
    let sec = heure.getSeconds();

    if (hours < 10) {
        hours = "0" + hours
    }
    if (min < 10) {
        min = "0" + min
    }
    if (sec < 10) {
        sec = "0" + sec
    }
    let horloge = hours + ":" + min + ":" + sec


    document.getElementById("horloge").innerHTML = horloge
    tempsDeRaffraichissement()

    if (heureActuelle != parseInt(hours)) {
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

function formatDateAndTime(dateAndTime = getDateAndTime()) {
    let date = dateAndTime[0].split("/")
    let time = dateAndTime[1].split(":")
    time = time[0]
    if (time.length == 1) {
        time = "0" + time
    }
    dateAndTime = date[2] + "-" + date[1] + "-" + date[0] + "T" + time + ":00"
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
// Change l'affichage de l'image en arrière plan selon qu'il fasse jour ou nuit

function isItDay(sunrise, sunset, time) {
    console.log(time)
    time = time.split(":")
    console.log(time)
    time = [parseInt(time[0]), parseInt(time[1])]
    console.log(time)
    if (time[0] < sunrise[0] || time[0] > sunset[0]) {
        return document.querySelector("body").style.backgroundImage = "url(\"images/cielNuit.png\")"
    } else if (time[0] == sunrise[0] && time[1] < sunrise[1]) {
        return document.querySelector("body").style.backgroundImage = "url(\"images/cielNuit.png\")"
    } else if (time[0] == sunset[0] && time[1] > sunset[1]) {
        return document.querySelector("body").style.backgroundImage = "url(\"images/cielNuit.png\")"
    } else {
        return document.querySelector("body").style.backgroundImage = "url(\"images/day.png\")"
    }
}

// Fonction d'affichage image en fonction du weathercode

function whichImageWeathercode(weathercode) {
    if (weathercode == 0) {
        return document.querySelector(".image").innerHTML = "<img  class=\"image\" src=\"images/Soleil.png\">"
    } else if ((weathercode == 1) || (weathercode == 2) || (weathercode == 3)) {
        return document.querySelector(".image").innerHTML = "<img  class=\"image\" src=\"images/BeauCouvert.png\">"
    } else if ((weathercode == 45) || (weathercode == 48)) {
        return document.querySelector(".image").innerHTML = "<img class=\"image\" src=\"images/Brumeux.png\">"
    } else if ((weathercode == 51) || (weathercode == 53) || (weathercode == 55)) {
        return document.querySelector(".image").innerHTML = "<img class=\"image\" src=\"images/PluieFine.png\">"
    } else if ((weathercode == 61) || (weathercode == 63) || (weathercode == 65)) {
        return document.querySelector(".image").innerHTML = "<img class=\"image\" src=\"images/Pluvieux.png\">"
    } else if ((weathercode == 66) || (weathercode == 67)) {
        return document.querySelector(".image").innerHTML = "<img class=\"image\" src=\"images/PluieVerglacante.png\">"
    } else if ((weathercode == 71) || (weathercode == 73) || (weathercode == 75) || (weathercode == 85) || (weathercode == 86)) {
        return document.querySelector(".image").innerHTML = "<img class=\"image\" src=\"images/Neige.png\">"
    } else if ((weathercode == 80) || (weathercode == 81) || (weathercode == 82)) {
        return document.querySelector(".image").innerHTML = "<img class=\"image\" src=\"images/AversePluie.png\">"
    } else if ((weathercode == 95)) {
        return document.querySelector(".image").innerHTML = "<img class=\"image\" src=\"images/Orageux.png\">"
    } else if ((weathercode == 96) || (weathercode == 99)) {
        return document.querySelector(".image").innerHTML = "<img class=\"image\" src=\"images/GrosOrage.png\">"
    }
}

//Vérifie si une date est valide

function isValidDate(date) {
    if (!maxDaysInMonth(date[0], date[1]) || date[2] < 1000 || date[2] > 9999) {
        return false
    }
    return true
}

function maxDaysInMonth(days, month) {
    if (["01", "03", "05", "07", "08", "10", "12"].includes(month) && parseInt(days) <= 31) {
        return true
    }
    else if (["04", "06", "09", "11"].includes(month) && parseInt(days) <= 30) {
        return true
    }
    else if (month == 02 && parseInt(days) <= 28) {
        return true
    }
    else {
        return false
    }
}

// Retourne le nombre de jour dans le mois passer en argument

function numberOfDaysInMonth(month) {
    if (["01", "03", "05", "07", "08", "10", "12"].includes(month)) {
        return 31
    }
    else if (["04", "06", "09", "11"].includes(month)) {
        return 30
    }
    else if (month == "02") {
        return 28
    }
}

// Retourne la date dans x jour(s)

function nextDate(x, date = getDateAndTime()[0]) {
    date = date.split("/")
    let newDays = String(parseInt(date[0]) + x)
    let newDate = [newDays, date[1], date[2]]
    if (isValidDate(newDate)) {
        date[0] = newDays
    } else if (date[1] == "12") {
        if (date[0] == "30" && x == 2 || date[0] == "31" && x == 1) {
            date = ["01", "01", String(parseInt(date[2]) + 1)]
        } else if (date[0] == "31" && x == 2) {
            date = ["02", "01", String(parseInt(date[2]) + 1)]
        }
    } else {
        date = [String((parseInt(newDays) - numberOfDaysInMonth(date[1]))), String(parseInt(date[1]) + 1), date[2]]
    }
    if (date[0].length == 1) {
        date[0] = "0" + date[0]
    }
    if (date[1].length == 1) {
        date[1] = "0" + date[1]
    }
    date = date.join("/")
    return date
}

// Affichage des dates dans le menu déroulant

document.querySelector("#aujourdhui").innerText = getDateAndTime()[0]
document.querySelector("#demain").innerText = nextDate(1)
document.querySelector("#apres-demain").innerText = nextDate(2)
document.querySelector("#aujourdhui").value = getDateAndTime()[0]
document.querySelector("#demain").value = nextDate(1)
document.querySelector("#apres-demain").value = nextDate(2)

// Fonction du bouton qui permet d'afficher les prévisions à l'heure et la date séléctionnées

function affichePrevisions() {
    console.log(document.querySelector("#selection-jour").value + " " + document.querySelector("#selection-heure").options[document.querySelector("#selection-heure").selectedIndex].text)
    const heure = document.querySelector("#selection-heure").options[document.querySelector("#selection-heure").selectedIndex].text
    const dateAndTime = [document.querySelector("#selection-jour").value, heure]
    getWeather("https://api.open-meteo.com/v1/meteofrance?latitude=47.22&longitude=-1.55&hourly=temperature_2m,precipitation,weathercode&daily=sunrise,sunset&timezone=Europe%2FBerlin")
        .then(data => {
            console.log(heure)
            traitementDesDonnées(data, returnIndexOfDate(data, formatDateAndTime(dateAndTime)));
            isItDay(sunrise(data), sunset(data), heure)
        })
        .catch(err => console.log("rejected\n", err.message))
}

// Reset au temps actuel

function resetPrevisions() {
    getWeather("https://api.open-meteo.com/v1/meteofrance?latitude=47.22&longitude=-1.55&hourly=temperature_2m,precipitation,weathercode&daily=sunrise,sunset&timezone=Europe%2FBerlin")
        .then(data => {
            traitementDesDonnées(data);
            isItDay(sunrise(data), sunset(data), getDateAndTime()[1])
        })
        .catch(err => console.log("rejected\n", err.message))
}
