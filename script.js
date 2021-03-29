console.log('I am connected to HTML');
var APIkey = "d1cbb5981d42bc71b129a89f7ff66db5";

var dateToday = moment().format('l');

// Prevent search without entering a city
$("#city").on("click", function () {
    $("#search").attr("disabled", false);
});

var cities = [];
var city = {
    input: $("#city"),
};

// Adding cities function
function fillCity() {

    // Empty city array
    $("#cities").empty();
    // Loop append for additional cities
    for (let i = 0; i < cities.length; i++) {
        var cityButton = $("<li>")
        cityButton.attr("city", cities[i]).attr("class", "list-group-item list-group-item-light list-group-item-action");
        cityButton.text(cities[i]);
        $("#cities").append(cityButton);
    }

    $("li").on("click", function (e) {
        e.preventDefault();
        var selectCity = $(this).attr("city");
        $("#city").val(selectCity)
        $("#cityDiv").remove();
        $("#fiveday").empty();
        callWeather();
    });

};

$("#search").on("click", function (e) {
    e.preventDefault();
    city.input = $("#city")
    var cityInput = $(city.input).val().trim();
    cities.push(cityInput);
    $("#cityDiv").remove();
    $("#fiveday").empty();
    fillCity();
    callWeather();
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(cities);
});

function callWeather() {

    var cityInput = $(city.input).val().trim();
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + APIkey
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            
            var currentDiv = $("<div>");
            var citySpan = $("<span>");
            var tempP = $("<p>");
            var humP = $("<p>");
            var windP = $("<p>");
            var uvSpan = $("<p>");
            var icon = $("<img>");
            var forecast = $("<span>");

            var qLat = response.coord.lat;
            var qLon = response.coord.lon;

            var cityName = response.name;
            var cityTemp = response.main.temp;
            var cityHum = response.main.humidity;
            var cityWind = response.wind.speed;
            var cityCond = response.weather[0].description;

            var iconBase = "http://openweathermap.org/img/wn/";
            var iconResponse = response.weather[0].icon;

            $("#current").append(currentDiv);
            $(currentDiv).append(citySpan).attr("id", "cityDiv")
            $(citySpan).attr("id", "citySpan").text(cityName + " " + dateToday + " ").append(icon).append("(" + cityCond + ")").append(tempP).append(humP).append(windP).append(uvSpan).append(forecast);
            $(icon).attr("src", iconBase + iconResponse + ".png")
            $(tempP).text("Temperature: " + cityTemp + " ºF");
            $(humP).text("Humidity: " + cityHum + "%");
            $(windP).text("Wind Speed: " + cityWind + " MPH");
            $(uvSpan).attr("id", "uv");
            $(forecast).text("Five Day Forecast").attr("class", "text");

            var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&units=imperial&appid=" + APIkey
            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function (response) {

                    var next = [
                        { day: moment().add(1, 'days').format('L') },
                        { day: moment().add(2, 'days').format('L') },
                        { day: moment().add(3, 'days').format('L') },
                        { day: moment().add(4, 'days').format('L') },
                        { day: moment().add(5, 'days').format('L') },
                    ];

                    var resDesc = [
                        response.list[5].weather[0].description,
                        response.list[13].weather[0].description,
                        response.list[21].weather[0].description,
                        response.list[29].weather[0].description,
                        response.list[37].weather[0].description,
                    ];
                    var resCond = [
                        response.list[5].weather[0].icon,
                        response.list[13].weather[0].icon,
                        response.list[21].weather[0].icon,
                        response.list[29].weather[0].icon,
                        response.list[37].weather[0].icon,
                    ];
                    var resTemp = [
                        response.list[5].main.temp,
                        response.list[13].main.temp,
                        response.list[21].main.temp,
                        response.list[29].main.temp,
                        response.list[37].main.temp,
                    ];
                    var resHum = [
                        response.list[5].main.humidity,
                        response.list[13].main.humidity,
                        response.list[21].main.humidity,
                        response.list[29].main.humidity,
                        response.list[37].main.humidity,
                    ];

                    for (let i = 0; i < 5; i++) {

                        var smallCol = $("<div>");
                        var dayS = $("<p>");
                        var tempPS = $("<p>");
                        var humPS = $("<p>");
                        var iconS = $("<img>");

                        var day = next[i].day;
                        var iconBase = "http://openweathermap.org/img/wn/";
                        var iconResponse = resCond[i];
                        var temp = resTemp[i];
                        var cond = resDesc[i];
                        var hum = resHum[i];

                        $("#fiveday").append(smallCol);
                        $(smallCol).attr("class", "smallWeather").append(dayS).append("(" + cond + ")").append(iconS).append(tempPS).append(humPS)
                        $(iconS).attr("src", iconBase + iconResponse + ".png");
                        $(tempPS).text("Temp: " + temp + "ºF");
                        $(humPS).text("Humidity: " + hum + "%");
                        $(dayS).text(day).attr("class", "bold");

                    }
                });

            var queryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + qLat + "&lon=" + qLon + "&appid=" + APIkey;
            $.ajax({
                url: queryURL,
                method: "GET"
            })
                .then(function (response) {

                    var uvRes = response[0].value;
                    var uvIndex = $("<span>");

                    $("#uv").text("UV Index:").append(uvIndex)
                    $(uvIndex).text(uvRes);

                    if (uvRes <= 2) {
                        $(uvIndex).attr("class", "uvLow").append(" (low)");
                    }
                    if (uvRes > 2 && uvRes <= 5) {
                        $(uvIndex).attr("class", "uvMed").append(" (medium)");
                    }
                    if (uvRes > 5 && uvRes <= 7) {
                        $(uvIndex).attr("class", "uvHigh").append(" (high)");
                    }
                    if (uvRes > 7 && uvRes <= 11) {
                        $(uvIndex).attr("class", "uvVH").append(" (very high)");
                    }
                    if (uvRes >= 11) {
                        $(uvIndex).attr("class", "uvEH").append(" (extremely high)");
                    };

                });

            clearCity(); 
        });
};

// for clearing and search for new a city
function clearCity() {
    $("#city").val("");
    $("#search").attr("disabled", true);
};
// saves the city after you have searched for it 
$(window).on("load", function () {
    cities = JSON.parse(localStorage.getItem("cities"));
    if (cities === null) {
        cities = [];
    }
    else if (cities !== null) {
        cities = JSON.parse(localStorage.getItem("cities"));
        $("#saved").attr("disabled", true);
        fillCity();
    };
});