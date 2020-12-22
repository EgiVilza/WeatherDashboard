//Variables
var searchButton = $("#searchButton")
var city = ""
var cityArray = JSON.stringify(["","","","","","","",""])
var savedResults = document.querySelector(".savedResults")
var savedCitiesButton = $(".savedCities")


//API Variables
// This is our API key
var APIKey = "166a433c57516f51dfab1f7edaed8413";

// Here we are building the URL we need to query the database
var queryURL = ""

//API for UV index
var lat = ""
var lon = ""
var queryURL2 = ""

//API for 5 day weather forcast
var queryURL3 = ""



//If localStorage "ECityArray" is not in the browser, then create it
if (localStorage.getItem("ECityArray") === null) {
    localStorage.setItem("ECityArray", cityArray)
}



//Add saved cities from localstorage to the web page buttons
for (var i = 0; i < 8; i++) {
    var cityArray = JSON.parse(localStorage.getItem("ECityArray"))
    $("#button" + i).text(cityArray[i])
}



//When search button is clicked, it saves the city input onto localStorage
//and updates the recent search history
searchButton.on("click", function() {
    for (var i = 8; i > 0; i--) {
        var previousCity = $("#button" + (i-1)).text()
        $("#button" + i).text(previousCity)
    }
    city = $(".formText").val()
    var getStorage = JSON.parse(localStorage.getItem("ECityArray"))
    getStorage[0] = city
    $("#button0").text(city)

    for (var i = 0; i < 8; i++) {
        getStorage[i] = $("#button"+i).text().trim()
    }
    localStorage.setItem("ECityArray", JSON.stringify(getStorage))
    queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
    "q="+ city + "&appid=" + APIKey;

    queryURL3 = "http://api.openweathermap.org/data/2.5/forecast?q=" + 
    city + "&appid=" + APIKey

    todaysWeatherQuery()
})

savedCitiesButton.on("click", function(element) {

    city = $(this).text()
    queryURL = "https://api.openweathermap.org/data/2.5/weather?" +
    "q="+ city + "&appid=" + APIKey;

    queryURL3 = "http://api.openweathermap.org/data/2.5/forecast?q=" + 
    city + "&appid=" + APIKey

    todaysWeatherQuery()

})

//Function for the weather query
function todaysWeatherQuery() {

    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {

    var humidity = response.main.humidity
    var windspeed = response.wind.speed
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    
    lat = response.coord.lat
    lon = response.coord.lon

    var list = document.querySelector(".list")
    list.children[0].textContent = "Temperature: " + tempF.toFixed(2)
    list.children[1].textContent = "Humidity: " + humidity.toFixed(2)
    list.children[2].textContent = "Wind Speed: " + windspeed.toFixed(2)
    
    queryURL2 = "http://api.openweathermap.org/data/2.5/uvi?lat=" + 
    lat + "&lon=" + lon + "&appid=" + APIKey

    UVQuery()

  });

}

function UVQuery() {
    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL2,
        method: "GET"
    })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {
        var UVIndex = response.value
        document.querySelector(".list").children[3].textContent = "UV Index: " + UVIndex
    
    });

    FiveDayForcast()

}
  
function FiveDayForcast() {
    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
        url: queryURL3,
        method: "GET"
    })
    // We store all of the retrieved data inside of an object called "response"
    .then(function(response) {

        console.log(response)

        var num = -8

        for (var i = 0; i < 5; i++) {
            num = num + 8
            var dateTime = response.list[num].dt_txt
            var dateOnly = dateTime.split(" ")
            var weather = response.list[num].weather[0].description
            var humidity = response.list[num].main.humidity
            var tempF = (response.list[num].main.temp - 273.15) * 1.80 + 32;

            var forcast = document.querySelector(".fiveDayForcastGrid")
            forcast.children[i].children[0].textContent = dateOnly[0]
            forcast.children[i].children[1].textContent = weather
            forcast.children[i].children[2].textContent = "Temp: " + tempF.toFixed(2)
            forcast.children[i].children[3].textContent = "Humidity: " + humidity

        }

        //City and Todays Date
        var dateTime = response.list[num].dt_txt
        var dateOnly = dateTime.split(" ")
        $(".Title").text(city + " " + dateOnly[0])

    });
  
}
