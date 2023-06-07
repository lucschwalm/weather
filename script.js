var cityInput = $("#city");
var searchBtn = $("#search");
var APIkey = "109c4e4a5597989530674ec8a676de90";


function clickHandler() {
    var city = cityInput.val();
    getResponse(city);
}

async function getResponse(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey;
    var response = await fetch(queryURL);
    var jsonData = await response.json();
    console.log(jsonData);
}