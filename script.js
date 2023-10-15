const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("weather-type"),
    windSpeed = document.getElementById("wind-speed"),
    humidity = document.getElementById("humidity"),
    mainIcon = document.getElementById("icon"),
    visibility = document.getElementById("visibility"),
    humidity_status = document.querySelector('.humidity-status'),
    airPressure = document.getElementById("air-pressure"),
    weatherCards = document.getElementById("weather-cards"),
    celsiusBtn = document.querySelector(".celsius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    viewFormButton = document.getElementById("view-form-btn"),
    overlay = document.getElementById("overlay"),
    closeButton = document.getElementById("close-btn"),
    searchForm = document.getElementById("search"),
    search = document.getElementById("query"),
    meter = document.querySelector('meter'),
    submitBtn = document.getElementById('submit-btn');
    
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
        // console.log(data);
        currentCity = data.city;
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
                temp.innerText = today.temp.toFixed(0);
            } else { 
                temp.innerText = `${celsiusToFahrenheit(today.temp)}`;
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            windSpeed.innerText = today.windspeed;
            humidity.innerText = today.humidity.toFixed(0);
            meter.setAttribute('value', today.humidity)
            meter.setAttribute("style", "--low: 30%; --moderate: 50%; --high: 100%;");
            visibility.innerText = today.visibility;
            airPressure.innerText = today.pressure; 
            mainIcon.src = getIcon(today.icon);
            if (hourlyorWeek === "hourly") {
                updateForecast(data.days[0].hours, unit, 'day');
            } else {
                updateForecast(data.days, unit, 'week');
            }
        })
        .catch(error => {
            alert("City not found in our database");
        });
}


//celsius to fahrenheit
function celsiusToFahrenheit(temp) {
    return ((temp * 9) / 5 + 32).toFixed(0);
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

fahrenheitBtn.addEventListener("click", () => {
    changeUnit("°F");    
});
celsiusBtn.addEventListener("click", () => {
    changeUnit("°C");
});

function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit;
    {
        tempUnit.forEach(elem => {
            elem.innerText = `${unit}`;
        })

        if (unit === "°C") {
            celsiusBtn.classList.add("active");
            fahrenheitBtn.classList.remove("active");
        } else {
            fahrenheitBtn.classList.add("active");
            celsiusBtn.classList.remove("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
    }
};

//to make the search bar open 
viewFormButton.addEventListener("click", function() {
    overlay.style.display = "block";
});

closeButton.addEventListener('click', function() {
    overlay.style.display = "none";
});

submitBtn.addEventListener('click', function() {
    overlay.style.display = "none";
});

//TO make search bar work to display cities and auto-fill them
searchForm.addEventListener('submit', (e) => {  
    e.preventDefault();
    let location = search.value.trim();
    if (location) {
        currentCity = location;
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
});


//To get list of cities
let cities = [];
let currentFocus = -1;

async function fetchCities() {
    try {
        const response  = await fetch('cities.json');
        cities = await response.json();
    } catch (error) {
        console.error('Error fetching city:', error);
        cities = [];
    }
}
fetchCities();

//to create a suggestion in search results

search.addEventListener('input', function(e) { 
  e.preventDefault();
  removeSuggestions();  
  let val = this.value;
   
  if (!val) {  
    return false;
  }
  currentFocus = -1;

 let suggestionList = document.createElement("ul");
 suggestionList.setAttribute("id", "suggestions");
 this.parentNode.appendChild(suggestionList); 

 for (i = 0; i < cities.length; i++){
    if (cities[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        let suggestionItem = document.createElement("li");
        suggestionItem.innerHTML = "<strong>" + cities[i].name.substr(0, val.length) + "</strong>";
        suggestionItem.innerHTML += cities[i].name.substr(val.length);
        suggestionItem.innerHTML += "<input type='hidden' value = '" + cities[i].name + "'>";
        
        suggestionItem.addEventListener("click", function (e) { 
            search.value = this.getElementsByTagName("input")[0].value;
            removeSuggestions();
        });
        suggestionList.appendChild(suggestionItem);
    };
}
});

function removeSuggestions() {
    let x = document.getElementById("suggestions");
    if(x) x.parentNode.removeChild(x);
}

search.addEventListener("keydown", function (e) {
    let x = document.getElementById("suggestions");
    if(x) x = x.getElementsByTagName('li');

    if(e.key == 40) {
        currentFocus++;
        addActive(x);
    } else if (e.key == 38) {
        currentFocus--;
        addActive(x)
    }
    if (e.key == 13) {
        e.preventDefault();
        if (currentFocus > -1) {
            if (x) x[currentFocus].click();
        }
    }
});

function addActive(x){
    if(!x) return false;
    removeActive(x);
    if(currentFocus > x.length) currentFocus = 0;
    if(currentFocus < 0) currentFocus = x.length - 1;

    x[currentFocus].classList.add("active");
}

function removeActive(x){
    if(!x) return;
    for(let i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
}

// search.setAttribute("list", "suggestions");