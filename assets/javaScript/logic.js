"use strict";
const userCardEl = $("#custom-card");
const userInputEl = document.querySelector("#input-area");
const weatherNowEl = $("#main-container");
const displayIcon = $("#weather-icon");
const futureForecast = $("#five-days");

const displayTemp = $("#temperature");
const displayHumi = $("#humidity");
const displayWindSpeed = $("#wind-speed");
const displayUvIndex = $("#uv-index-5");
const previousSearch = $("#searched-button");
const currentDate = $("#current-date")

const apiKey = "f846e26f3aae4ab1fe222c8a837c3a9f"
const apiQueryUrl = "api.openweathermap.org/data/2.5/weather?&appid=f846e26f3aae4ab1fe222c8a837c3a9"
const createSearch = $("#newButton");
const submitBtn = document.querySelector('#search-button');

let clickedBtn = '';

function formSubmitHandler (event) {
    event.preventDefault();
    console.log(userInputEl);
    let givenInput = userInputEl.value.trim().toLowerCase() || clickedBtn;


    if (givenInput) {
        searchInputLocation(givenInput);
        
    } else {
        alert("Provide City to Search For!!")
    }
}


function searchInputLocation(givenInput) {
    let input = `https://api.openweathermap.org/data/2.5/weather?q=${givenInput}&appid=${apiKey}`;

    fetch(input)
        .then(function (response) {
            if (response.ok) {

                response.json()
                    .then(function (data) {
                        oneWeatherCall(data.coord.lat, data.coord.lon);
                    })
            };

        });


};

let oneWeatherCall = function (lat, lon) {
    let input2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // fetch data from one call api   
    fetch(input2)
        .then(function (response) {
            // check response status
            if (response.ok) {

                response.json()
                    .then(function (data) {
                        console.log(data);
                        // clean fields before displaying new data
                        weatherNowEl.text("");
                        displayTemp.text("");
                        displayHumi.text("");
                        displayWindSpeed.text("");
                        displayUvIndex.text("");
                        futureForecast.addClass("hidden");
                        localStorageHandling(userInputEl.value);

                        //current date
                        let daynow = new Date();
                        let weekday = daynow.getDay();
                        let month = daynow.getMonth();
                        let day = daynow.getDate();

                        let monthNow = getMonth(month);
                        let weeks = getWeek(weekday);
                        currentDate.removeClass("hidden");
                        currentDate.text(`${weeks}, ${monthNow}  ${day}`);

                        // city name handling components
                        let cityName = userInputEl.value.trim().toUpperCase() || clickedBtn;
                        let createCityEl = $("<h4>").text(cityName);    
                        weatherNowEl.append(createCityEl);
                        weatherNowEl.removeClass("hidden");

                        // Icon Handling component ---- Not Completed.
                        let weatherConditions = data.current.weather[0].main.toLowerCase();
                        displayIcon.removeClass("hidden");
                        if (weatherConditions == "clear") {
                            displayIcon.text("🌞");
                        } else if (weatherConditions == "clouds") {
                            displayIcon.text("🌤️");
                        } else if (weatherConditions == "scaterred clouds" || weatherConditions == "broken clouds") {
                            displayIcon.text("☁️");
                        } else if (weatherConditions == "thunderstorm") {
                            displayIcon.text("⛈️");
                        } else if (weatherConditions == "shower rain" || weatherConditions == "rain") {
                            displayIcon.text("🌧️");
                        }

                        // temperature data handling components
                        let getTemp = data.current.temp;
                        // converting from Kelvin to F
                        let currentTemp = (getTemp - 273.15) * 9 / 5 + 32;
                        let currentTempEl = $("<p>").text(`Temperature: ${currentTemp.toFixed(1)} F`);
                        displayTemp.append(currentTempEl);
                        displayTemp.removeClass("hidden");

                        //  Humidity data handling component
                        let getHumidity = data.current.humidity;
                        let currentHumidityEl = $("<p>").text(`Humidity: ${getHumidity} %`);
                        displayHumi.append(currentHumidityEl);

                        // wind Speed data handling component
                        let getWind = data.current.wind_speed;
                        let currentWindEl = $("<p>").text(`Wind-speed: ${getWind} mph`);
                        displayWindSpeed.append(currentWindEl);

                        //UV Index data handling component 
                        let getUvIndex = data.current.uvi;
                        let currentUvEl = $("<p>");
                        let uvIndexFunc = function () {
                            currentUvEl.text(`UV-index: ${getUvIndex}`);
                            displayUvIndex.append(currentUvEl);
                            displayUvIndex.removeClass("hidden");

                        }
                        //Need to be able to override Css  
                        if (getUvIndex >= 11) {
                            currentUvEl.addClass("custom-extreme-uvIndex");
                            uvIndexFunc();
                        } else if (getUvIndex > 7 && getUvIndex <= 10) {
                            currentUvEl.addClass("custom-vhigh-uvIndex");

                            uvIndexFunc();
                        } else if (getUvIndex > 6 && getUvIndex <= 7) {
                            currentUvEl.addClass("custom-uvIndex");
                            uvIndexFunc();
                        } else if (getUvIndex > 3 && getUvIndex <= 6) {
                            currentUvEl.addClass("custom-moderate-uvIndex");
                            uvIndexFunc();
                        } else if (getUvIndex <= 3) {
                            currentUvEl.addClass("custom-low-uvIndex");
                            uvIndexFunc();
                        }


                        // ---------------------------------------------------------------//
                        // Five Days Forecast
                        // --------------------------------------------------------------//

                        for (let i = 0; i < 6; i++) {
                            futureForecast.removeClass("hidden");
                            let fiveDaysIcon = $(`#weather-icon-${i}`)
                            let futureTemp = $(`#temperature-${i}`);
                            let displayFutureHumidity = $(`#humidity-${i}`);
                            let displayFutureWind = $(`#wind-speed-${i}`)
                            let displayFutureUvEl = $(`#uv-index-${i}`);
                            let futureDate = $(`#current-date-${i}`)

                            futureTemp.text("");
                            displayFutureHumidity.text("");
                            displayFutureWind.text("");
                            displayFutureUvEl.text("");

                            // Date for future forecast
                            let futureWeek = getWeek(weekday + (i + 1));
                            let futureMonth = getMonth(month);
                            let futureDay = day + (i + 1);
                            futureDate.text(`${futureWeek}, ${futureMonth} ${futureDay}`);




                            let weatherConditions = data.daily[i].weather[0].main.toLowerCase();
                            if (weatherConditions == "clear") {
                                fiveDaysIcon.text("🌞");
                            } else if (weatherConditions == "clouds") {
                                fiveDaysIcon.text("🌤️");
                            } else if (weatherConditions == "scaterred clouds" || weatherConditions == "broken clouds") {
                                fiveDaysIcon.text("☁️");
                            } else if (weatherConditions == "thunderstorm") {
                                fiveDaysIcon.text("⛈️");
                            } else if (weatherConditions == "shower rain" || weatherConditions == "rain") {
                                fiveDaysIcon.text("🌧️");
                            }

                            // temperature data handling components
                            let fiveDaysTemp = data.daily[i].temp.day;

                            // converting from Kelvin to F
                            let tempConversion = (fiveDaysTemp - 273.15) * 9 / 5 + 32;
                            futureTemp.text(`Temperature: ${tempConversion.toFixed(1)} F`);


                            //  Humidity data handling component
                            let futureHumidity = data.daily[i].humidity;

                            displayFutureHumidity.text(`Humidity: ${futureHumidity} %`);


                            // wind Speed data handling component
                            let futureWind = data.daily[i].wind_speed;

                            displayFutureWind.text(`Wind-speed: ${futureWind} mph`);


                            //UV Index data handling component 
                            let futureUvIndex = data.daily[i].uvi;


                            let futureUvIndexFunc = function () {
                                displayFutureUvEl.text(`UV-index: ${futureUvIndex}`);

                            }
                            //Need to be able to override Css  
                            if (futureUvIndex >= 11) {
                                displayFutureUvEl.addClass("custom-extreme-uvIndex");
                                futureUvIndexFunc();
                            } else if (futureUvIndex > 7 && futureUvIndex <= 10) {
                                displayFutureUvEl.addClass("custom-vhigh-uvIndex");
                                futureUvIndexFunc();
                            } else if (futureUvIndex > 6 && futureUvIndex <= 7) {
                                displayFutureUvEl.addClass("custom-uvIndex");
                                futureUvIndexFunc();
                            } else if (futureUvIndex > 3 && futureUvIndex <= 6) {
                                displayFutureUvEl.addClass("custom-moderate-uvIndex");
                                futureUvIndexFunc();
                            } else if (futureUvIndex <= 3) {
                                displayFutureUvEl.addClass("custom-low-uvIndex");
                                futureUvIndexFunc();
                            }

                        }
                    })
            };
        });



}

let getMonth = function (m) {

    let monthNow;


    if (m == 0) {
        monthNow = "January";
    } else if (m == 1) {
        monthNow = "February";
    } else if (m == 2) {
        monthNow = "March";
    } else if (m == 3) {
        monthNow = "April";
    } else if (m == 4) {
        monthNow = "May";
    } else if (m == 5) {
        monthNow = "June";
    } else if (m == 6) {
        monthNow = "July";
    } else if (m == 7) {
        monthNow = "August";
    } else if (m == 8) {
        monthNow = "September";
    } else if (m == 9) {
        monthNow = "October";
    } else if (m == 10) {
        monthNow = "November";
    } else if (m == 11) {
        monthNow = "December"
    }

    return monthNow;
}

let getWeek = function (w) {
    let week;
    if (w == 0 || w == 7) {
        week = "Sunday";
    } else if (w == 1) {
        week = "Monday";
    } else if (w == 2) {
        week = "Tuesday";
    } else if (w == 3) {
        week = "Wednesday";
    } else if (w == 4) {
        week = "Thrusday";
    } else if (w == 5) {
        week = "Friday";
    } else if (w == 6) {
        week = "Saturday";
    }

    return week;
}




let localStorageHandling = function (cityName) {
    const cityList = {};    
    
    let cities = JSON.parse(localStorage.getItem("cityList")) || [];
    if(cityName){ 
        cities.push(cityName);
    }    
    localStorage.setItem("cityList", JSON.stringify(cities));
    
}

let addCity = function(city){
    if(city){
    let createCity = $("<button>").text(city).attr({"type":"text", "class":"btn btn-light new-button" });
    previousSearch.append(createCity);
    }
    
}

let previousSearches = function (){
    let cities = JSON.parse(localStorage.getItem("cityList")) || [];
    
    if(cities.length > 0){
        searchInputLocation(cities[cities.length - 1]);
    }
    
    for(let i = 0; i < cities.length; i++){
        addCity(cities[i]);
    }
    // console.log(cities);
}
previousSearches();

let getPrevious = $(".new-button");
getPrevious.on("click", function (event){
   
    clickedBtn = event.target.innerText;
    // console.log(clickedBtn.innerText);
    formSubmitHandler();
});




userCardEl.on("submit", formSubmitHandler)

