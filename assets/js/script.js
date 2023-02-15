$(document).ready(function () {

    $("#search-button").on("click", function () {

      var searchTerm = $("#search-value").val();

      $("#search-value").val("");
      weatherFunction(searchTerm);
      weatherForecast(searchTerm);
    });
  
    $("#search-button").keypress(function (event) {
      var keycode = (event.keyCode ? event.keyCode : event.which);
      if (keycode === 13) {
        weatherFunction(searchTerm);
        weatherForecast(searchTerm);
      }
    });
  
    var history = JSON.parse(localStorage.getItem("history")) || [];
  

    if (history.length > 0) {
      weatherFunction(history[history.length - 1]);
    }

    for (var i = 0; i < history.length; i++) {
      createRow(history[i]);
    }
  
    function createRow(text) {
      var listItem = $("<li>").addClass("list-group-item").text(text);
      $(".history").append(listItem);
    }
  
    $(".history").on("click", "li", function () {
      weatherFunction($(this).text());
      weatherForecast($(this).text());
    });
  
    function weatherFunction(searchTerm) {
  
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=6385c5e4831086d2c35aab622d170668&units=imperial",
  
  
      }).then(function (data) {
        if (history.indexOf(searchTerm) === -1) {
          history.push(searchTerm);

          localStorage.setItem("history", JSON.stringify(history));
          createRow(searchTerm);
        }

        $("#today").empty();
  
        var title = $("<h3>").addClass("card-title").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var img = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
  
  
        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");
        var wind = $("<p>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH");
        var humid = $("<p>").addClass("card-text").text("Humidity: " + data.main.humidity + "%");
        var temp = $("<p>").addClass("card-text").text("Temperature: " + data.main.temp + " °F");
        console.log(data)
        var lon = data.coord.lon;
        var lat = data.coord.lat;
  
        $.ajax({
          type: "GET",
          url: "https://api.openweathermap.org/data/2.5/uvi?appid=6385c5e4831086d2c35aab622d170668&lat=" + lat + "&lon=" + lon,
        });

        title.append(img);
        cardBody.append(title, temp, humid, wind);
        card.append(cardBody);
        $("#today").append(card);
        console.log(data);
      });
    }

    function weatherForecast(searchTerm) {
      $.ajax({
        type: "GET",
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm + "&appid=6385c5e4831086d2c35aab622d170668&units=imperial",
  
      }).then(function (data) {
        console.log(data);
        $("#forecast").html("<h4 class=\"mt-3\">5-Day Forecast:</h4>").append("<div class=\"row\">");
  
        for (var i = 0; i < data.list.length; i++) {
  
          if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
  
            var titleFive = $("<h3>").addClass("card-title").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            var imgFive = $("<img>").attr("src", "https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png");
            var colFive = $("<div>").addClass("col-md-2.5");
            var cardFive = $("<div>").addClass("card bg-primary text-white");
            var cardBodyFive = $("<div>").addClass("card-body p-2");
            var windFive = $("<p>").addClass("card-text").text("Wind Speed: " + data.list[i].wind.speed + " MPH")
            var humidFive = $("<p>").addClass("card-text").text("Humidity: " + data.list[i].main.humidity + "%");
            var tempFive = $("<p>").addClass("card-text").text("Temperature: " + data.list[i].main.temp + " °F");
  
            colFive.append(cardFive.append(cardBodyFive.append(titleFive, imgFive, tempFive, humidFive, windFive)));

            $("#forecast .row").append(colFive);
          }
        }
      });
    }
  
  });
