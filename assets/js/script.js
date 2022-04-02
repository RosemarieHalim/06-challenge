//NOTES
//search for city > form with input and submit button > local storage past searches (array?)
// weather section has current date function and server side api function calling temp, wind, humidity, and uv index.
//5-day forcast is a row of five columns moment date function of five else if statements for each other day

const formEl = document.querySelector("form")
const inputEl = document.querySelector("input")
const listEl = document.getElementById("cities")
var apiKey = "19d419ac3d30639b4584261671db56a7"

window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            var long = position.coords.longitude;
            var lat = position.coords.latitude;
            var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&appid=" + apiKey + "&units=metric";
            console.log(url);
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    displayTodayWeather(data.current);
                    displayForecastWeather(data.daily);
                });
        });
    }
});

// SEARCH FUNCTION
async function searchCity() {
    var cityName = document.getElementById('citySearch').value;
    document.getElementById('cityContent').textContent = cityName + ' ' + '(' + moment().format('L') + ')';

    if (!localStorage.getItem(cityName)) {
        var cityLi = document.createElement('li');
        cityLi.setAttribute('onclick', 'researchCity("' + cityName + '");');
        cityLi.textContent = cityName;
        document.getElementById('cities').append(cityLi);
    }
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + apiKey;
    let response = await fetch(url);
    let data = await response.json();
    cityWeather(data.coord.lat, data.coord.lon);
    localStorage.setItem(cityName, cityName);
}

// RESEARCH CITY FUNCTION
function researchCity(cityName) {
    document.getElementById('citySearch').value = cityName;
    searchCity();
}

// KEEP VALUE FUNCTION
function keepCity() {
    var keys = Object.keys(localStorage);
    var keyLength = keys.length;
    while(keyLength--) {
        var cityLi = document.createElement('li');
        cityLi.textContent = localStorage.getItem(keys[keyLength]);
        cityLi.setAttribute('onclick', 'researchCity("' + keys[keyLength] + '");');
        document.getElementById('cities').append(cityLi);
    };
};

// CURRENT DAY FORECAST FUNCTION
function displayTodayWeather(today) {
    document.getElementById('icon').setAttribute('src', 'http://openweathermap.org/img/wn/' + today.weather[0].icon + '@2x.png');
    document.getElementById('temp').textContent = 'Temp: ' + Math.trunc(today.temp) + '°C';
    document.getElementById('wind').textContent = 'Wind: ' + Math.trunc(today.wind_speed) + ' km/h';
    document.getElementById('humid').textContent = 'Humidity: ' + today.humidity + '%';
    document.getElementById('uv').textContent = 'UV Index: ' + today.uvi;
}

// FIVE DAY FORECAST FUNCTION
function displayForecastWeather(dayList) {
    for(var i = 0; i < dayList.length; i++) {
        document.getElementById('date' + (i + 1)).textContent = moment(new Date(), 'mm-dd-yyyy').add(i + 1, 'days').format('L');
        document.getElementById('icon' + (i + 1)).setAttribute('src', 'http://openweathermap.org/img/wn/' + dayList[i].weather[0].icon + '@2x.png');
        document.getElementById('temp' + (i + 1)).textContent = 'Temp: ' + Math.trunc(dayList[i].temp.max) + '°C';
        document.getElementById('wind' + (i + 1)).textContent = 'Wind: ' + Math.trunc(dayList[i].wind_speed) + ' km/h';
        document.getElementById('humid' + (i + 1)).textContent = 'Humidity: ' + dayList[i].humidity + '%';
    }
}

// 
async function cityWeather(lat, lon) {
    var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=metric";
    console.log(url);
    let response = await fetch(url);
    let data = await response.json();
        displayTodayWeather(data.current);
        displayForecastWeather(data.daily);
}

keepCity();