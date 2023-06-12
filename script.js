var cityInput = $("#city");
var searchBtn = $("#search");
var overview = $("#overview");
var forecastEl = $("#forecast");
var historyEl = $("#history");
var APIkey = "109c4e4a5597989530674ec8a676de90";
var currentDate = dayjs().format("MM/DD/YYYY");

console.log(localStorage);
console.log(localStorage.length);

function addHistory(index) {
    var history = document.createElement("button");
    history.classList.add("btn");
    history.textContent = localStorage.getItem(localStorage.key(index));
    historyEl.append(history);
}

function init() {
    for (var i=0; i<localStorage.length; i++) {
        addHistory(i);
    }
}

function clearData() {
    overview.html("");
    forecastEl.html("");
}

historyEl.on("click", function(event) {
    var buttonPressed = event.target;
    var city = buttonPressed.textContent;
    clearData();
    getResponse(city);
})

function clickHandler() {
    clearData();
    var city = cityInput.val();
    cityInput.val("");
    localStorage.setItem(city, city);

    var history = document.createElement("button");
    history.classList.add("btn");
    history.textContent = localStorage.getItem(city);
    historyEl.append(history);

    getResponse(city);
}

async function getResponse(city) {
    //fetches weather data for current day
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
    var response = await fetch(queryURL);
    var jsonData = await response.json();
    console.log(jsonData);

    //populates html with weather data for current day
    var cityName = document.createElement("h2");
    cityName.textContent = jsonData.name + " " + currentDate;
    cityName.classList.add("w-auto");
    overview.append(cityName);
    var iconImage = document.createElement("img");
    var iconID = "http://openweathermap.org/img/w/" + jsonData.weather[0].icon + ".png";
    iconImage.src = iconID;
    iconImage.classList.add("img-thumbnail");
    iconImage.classList.add("w-auto");
    overview.append(iconImage);
    var cityTemp = document.createElement("h3");
    var Temp = Math.round((jsonData.main.temp - 273.15) * 9/5 + 32);
    cityTemp.textContent = "Temp: " + Temp + "℉";
    overview.append(cityTemp);
    var cityWind = document.createElement("h3");
    cityWind.textContent = "Wind: " + jsonData.wind.speed + " MPH";
    overview.append(cityWind);
    var cityHumidity = document.createElement("h3");
    cityHumidity.textContent = "Humidity: " + jsonData.main.humidity + "%";
    overview.append(cityHumidity);

    //fetches forecast data for next 5 days
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey;
    var forecastResponse = await fetch(forecastURL);
    var forecastData = await forecastResponse.json();
    console.log(forecastData);

    var forecastHeader = document.createElement("h2");
    forecastHeader.textContent = "5-Day Forecast:";
    forecastEl.append(forecastHeader);
    //creates html card elements with forecast data
    function createWeatherCard(index){
        var card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("col");
        forecastEl.append(card);
        var cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        card.append(cardBody);

        var projectedDate = dayjs().add(index + 1, "day");
        var projectedDate = projectedDate.format("MM/DD/YYYY");

        var cityName = document.createElement("h2");
        cityName.textContent = forecastData.city.name + " " + projectedDate;
        cityName.classList.add("w-auto");
        cardBody.append(cityName);
        var iconImage = document.createElement("img");
        var iconID = "http://openweathermap.org/img/w/" + forecastData.list[index * 8].weather[0].icon + ".png";
        iconImage.src = iconID;
        iconImage.classList.add("img-thumbnail");
        iconImage.classList.add("w-auto");
        cardBody.append(iconImage);
        var cityTemp = document.createElement("h3");
        var Temp = Math.round((forecastData.list[index * 8].main.temp - 273.15) * 9/5 + 32);
        cityTemp.textContent = "Temp: " + Temp + "℉";
        cardBody.append(cityTemp);
        var cityWind = document.createElement("h3");
        cityWind.textContent = "Wind: " + forecastData.list[index * 8].wind.speed + " MPH";
        cardBody.append(cityWind);
        var cityHumidity = document.createElement("h3");
        cityHumidity.textContent = "Humidity: " + forecastData.list[index * 8].main.humidity + "%";
        cardBody.append(cityHumidity);
    }
    for(var i=0; i<5; i++){
        createWeatherCard(i);
    }
}

init();