const temp = document.getElementById("temp"),
     date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("weather-type"),
    windSpeed = document.getElementById("wind-speed"),
    humidity = document.getElementById("humidity"),
    mainIcon = document.getElementById("icon"),
    visibility = document.getElementById("visibility"),
    humidity_status = document.querySelector('.humidity-status'),
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
        getWeatherData(data.city , currentUnit , week);
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
            windSpeed.innerText = today.windspeed;
            humidity.innerText = today.humidity;
            humidity_status.setAttribute("value", today.humidity);
            humidity_status.setAttribute("style", "--low: 30%; --moderate: 50%; --high: 100%;");
            visibility.innerText = today.visibility;
            airPressure.innerText = today.winddir; 
            mainIcon.src = getIcon(today.icon);
        });
}

//celsius to fahrenheit
function celciusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(1);
} 


function getIcon(condition) {
    if (condition === "Partly-cloudy-day") {
        return "images/partly_cloudy.png";
    }else if (condition === "rain") {
        return "images/IsoRainSwrsDay.png";
    }else if (condition === "clear-day") {
        return "images/clear.png";
    }else if (condition === "mostly-cloudy-day") {
        return "images/mostly_cloudy.png";
    }else if (condition === "light-rain") {
        return "images/light_rain.png";
    }else if (condition === "fog" || "overcast") {
        return "images/fog.png";
    }else if (condition === "partly-cloudy-night") {
        return "images/partly_cloudy.png";
    }else {
        return "images/clear.png";
    }
}

