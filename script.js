const temp = document.getElementsByClassName("temp-number"),
     date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("weather-type"),
    windStatus = document.getElementById("wind-status"),
    humidity = document.getElementById("humidity"),
    meter = document.querySelector("meter"),
    visbility = document.getElementById("visibility"),
    airPressure = document.getElementById("air-pressure");


let currentCity = '';
let currentUnit = "c";
let week = "Week";



//Update Date-Time
function getDateTime() {
    let now = new Date();
        hour = now.getHours();
        minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        'Thursday',
        'Friday',
        'Saturday',
    ];

    //12 hour format
    hour = hour % 12;
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
        let dayString = days[now.getDay()];
        return `${dayString}, ${hour}:${minute}`;
}

date.innerText = getDateTime();

setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

//getting public IP

function getPublicIp() {
    fetch ("https://geolocation-db.com/json/", { 
        method: "GET",
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        currentCity = data.currentCity;
        getWeatherData(data.city , currentUnit , week)
    });
}

getPublicIp();

//functin to get weather data
 
function getWeatherData(city, unit, week) {
    const apiKey = "FWFMC5LMCS7CLPPCQYULYWCUJ";
    fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
        {
            method: "GET",
        }
    )
        .then((response) => response.json())
        .then((data) => {
            let today = data.currentConditions;
            if (unit === "c") {
                temp.innerText = today.temp;
            } else {
                temp.innerText = celciusToFahrenheit(today.temp);
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            windStatus.innerText = today.windstatus;
            humidity.innerText = today.humidity + "%";
            visbility.innerText = today.visbility;
            airPressure.innerText = today.airpressure; 
        });
}
//celsius to fahrenheit
function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
} 