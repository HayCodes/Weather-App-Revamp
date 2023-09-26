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
    weatherCards = document.getElementById("weather-cards");


let currentCity; 
let currentUnit = "°C";
let hourlyorWeek = "Week";


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
    // check for AM and PM
    let period = "AM";
    if (hour >= 12) {
        period = "PM";
    }
    //12 hour format
    hour = hour % 12;
    if (hour === 0) {
        hour = 12;
    }

    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}${period}`;
}

date.innerText = getDateTime();
// updates the time every second
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
        getWeatherData(data.city, currentUnit, hourlyorWeek);
    })
    .catch((error) => {
        console.error("Error fetching geolocation data:", error)
    });
}
getPublicIp();

//function to get weather data
function getWeatherData(city, unit, hourlyorWeek) {
    const apiKey = "FWFMC5LMCS7CLPPCQYULYWCUJ";
    // "5574fd253b882f1ebbef94f3a1abcc82";
    fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,{
        // https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            let today = data.currentConditions;
            if (unit === "°C") {
                temp.innerText = today.temp;
            } else { 
                temp.innerText = `${celsiusToFahrenheit(today.temp)}`;
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            windSpeed.innerText = today.windspeed;
            humidity.innerText = today.humidity;
            humidity_status.setAttribute("value", today.humidity);
            humidity_status.setAttribute("style", "--low: 30%; --moderate: 50%; --high: 100%;");
            visibility.innerText = today.visibility;
            airPressure.innerText = today.pressure; 
            mainIcon.src = getIcon(today.icon);
            if (hourlyorWeek === "hourly") {
                updateForecast(data.days[0].hours, unit, 'day');
            } else {
                updateForecast(data.days, unit, 'week');
            }
        });
}

//celsius to fahrenheit
function celsiusToFahrenheit(temp) {
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
    }else if (condition === "fog" || "overcast" || "overcast-clouds") {
        return "images/fog.png";
    }else if (condition === "partly-cloudy-night") {
        return "images/partly_cloudy.png";
    }else {
        return "images/clear.png";
    }
}

function getDayName(date) {
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[day.getDay()];
}

function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour < 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`
    } else {
        return `${hour}:${min} AM`;
    }
}

function updateForecast(data, unit, type) {
    weatherCards.innerHTML = '';
    
    let day = 0;
    let numCards = 7;
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");        
    
    if (type === "week") {
        dayName = getDayName(data[day].datetime);
    } 
    
    let dayTemp = data[day].temp;
    if (unit === "°F") {
        dayTemp = celsiusToFahrenheit(data[day].temp);
    }
    let iconCondition = data[day].icon;
    let iconSrc = getIcon(iconCondition);
    
    let tempUnit = "°C";
        if (unit === "°F") {
            tempUnit = "°F";
        }
 
    card.innerHTML = `
        <h2 class="day-name">${dayName}</h2>
        <div class="card-icon">
            <img src="${iconSrc}" alt="">
        </div>
        <div class="day-temp">
            <h2 class="high-temp">${dayTemp}</h2>
            <span class="temp-unit">${tempUnit}</span>
        </div>
        `;
    weatherCards.appendChild(card);
    day++;
    }
}


