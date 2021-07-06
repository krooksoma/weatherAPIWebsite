'use strict';
const userCardEl = document.querySelector('#custom-card');
const userInputEl = document.querySelector('#input-area');
const weatherNowEl = document.querySelector('#main-container');
const displayIcon = document.querySelector('#weather-icon');
const futureForecast = document.querySelector('#five-days');

const displayTemp = document.querySelector('#temperature');
const displayHumi = document.querySelector('#humidity');
const displayWindSpeed = document.querySelector('#wind-speed');
const displayUvIndex = document.querySelector('#uv-index-5');
const previousSearch = document.querySelector('#side-container');
const currentDate = document.querySelector('#current-date')

const apiKey = 'f846e26f3aae4ab1fe222c8a837c3a9f'
const apiQueryUrl = 'api.openweathermap.org/data/2.5/weather?&appid=f846e26f3aae4ab1fe222c8a837c3a9'
const createSearch = document.querySelector("#newButton");

let formSubmitHandler = function (event) {
    event.preventDefault();
    let givenInput = userInputEl.value.trim().toLowerCase();

    if (givenInput) {
        searchInputLocation(givenInput);
        userInputEl.textContent = '';
    } else {
        alert('Provide City to Search For!!')
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
                        weatherNowEl.textContent = '';
                        displayTemp.textContent = '';
                        displayHumi.textContent = '';
                        displayWindSpeed.textContent = '';
                        displayUvIndex.textContent = '';
                        futureForecast.classList.add('hidden');
                        localStorageHandling(userInputEl.value);

                        //current date
                        let daynow = new Date();
                        let weekday = daynow.getDay();
                        let month = daynow.getMonth();
                        let day = daynow.getDate();

                        let monthNow = getMonth(month);
                        let weeks = getWeek(weekday);
                        currentDate.classList.remove('hidden');
                        currentDate.textContent = `${weeks}, ${monthNow}  ${day}`;

                        // city name handling components
                        let cityName = userInputEl.value.trim().toUpperCase();
                        let createCityEl = document.createElement('h4');
                        createCityEl.textContent = cityName;
                        weatherNowEl.append(createCityEl);
                        weatherNowEl.classList.remove('hidden');

                        // Icon Handling component ---- Not Completed.
                        let weatherConditions = data.current.weather[0].main.toLowerCase();
                        displayIcon.classList.remove('hidden');
                        if (weatherConditions == 'clear') {
                            displayIcon.textContent = '🌞';
                        } else if (weatherConditions == 'clouds') {
                            displayIcon.textContent = '🌤️'
                        } else if (weatherConditions == 'scaterred clouds' || weatherConditions == 'broken clouds') {
                            displayIcon.textContent = '☁️';
                        } else if (weatherConditions == 'thunderstorm') {
                            displayIcon.textContent = '⛈️';
                        } else if (weatherConditions == 'shower rain' || weatherConditions == 'rain') {
                            displayIcon.textContent = '🌧️'
                        }

                        // temperature data handling components
                        let getTemp = data.current.temp;
                        // converting from Kelvin to F
                        let currentTemp = (getTemp - 273.15) * 9 / 5 + 32;
                        let currentTempEl = document.createElement('p');
                        currentTempEl.textContent = `Temperature: ${currentTemp.toFixed(1)} F`;
                        displayTemp.append(currentTempEl);
                        displayTemp.classList.remove('hidden');

                        //  Humidity data handling component
                        let getHumidity = data.current.humidity;
                        let currentHumidityEl = document.createElement('p');
                        currentHumidityEl.textContent = `Humidity: ${getHumidity} %`;

                        displayHumi.append(currentHumidityEl);

                        // wind Speed data handling component
                        let getWind = data.current.wind_speed;
                        let currentWindEl = document.createElement('p');
                        currentWindEl.textContent = `Wind-speed: ${getWind} mph`;
                        displayWindSpeed.append(currentWindEl);

                        //UV Index data handling component 
                        let getUvIndex = data.current.uvi;
                        let currentUvEl = document.createElement('p');

                        let uvIndexFunc = function () {
                            currentUvEl.textContent = `UV-index: ${getUvIndex}`;
                            displayUvIndex.append(currentUvEl);
                            displayUvIndex.classList.remove('hidden');

                        }
                        //Need to be able to override Css  
                        if (getUvIndex >= 11) {
                            currentUvEl.classList.add('custom-extreme-uvIndex');
                            uvIndexFunc();
                        } else if (getUvIndex > 7 && getUvIndex <= 10) {
                            currentUvEl.classList.add('custom-vhigh-uvIndex');

                            uvIndexFunc();
                        } else if (getUvIndex > 6 && getUvIndex <= 7) {
                            currentUvEl.classList.add('custom-uvIndex');
                            uvIndexFunc();
                        } else if (getUvIndex > 3 && getUvIndex <= 6) {
                            currentUvEl.classList.add('custom-moderate-uvIndex');
                            uvIndexFunc();
                        } else if (getUvIndex <= 3) {
                            currentUvEl.classList.add('custom-low-uvIndex');
                            uvIndexFunc();
                        }


                        // ---------------------------------------------------------------//
                        // Five Days Forecast
                        // --------------------------------------------------------------//

                        for (let i = 0; i < 6; i++) {
                            futureForecast.classList.remove('hidden');
                            let fiveDaysIcon = document.querySelector(`#weather-icon-${i}`)
                            let futureTemp = document.querySelector(`#temperature-${i}`);
                            let displayFutureHumidity = document.querySelector(`#humidity-${i}`);
                            let displayFutureWind = document.querySelector(`#wind-speed-${i}`)
                            let displayFutureUvEl = document.querySelector(`#uv-index-${i}`);
                            let futureDate = document.querySelector(`#current-date-${i}`)

                            futureTemp.textContent = '';
                            displayFutureHumidity.textContent = '';
                            displayFutureWind.textContent = '';
                            displayFutureUvEl.textContent = '';

                            // Date for future forecast
                            let futureWeek = getWeek(weekday + (i + 1));
                            let futureMonth = getMonth(month);
                            let futureDay = day + (i + 1);
                            futureDate.textContent = `${futureWeek}, ${futureMonth} ${futureDay}`;




                            let weatherConditions = data.daily[i].weather[0].main.toLowerCase();
                            if (weatherConditions == 'clear') {
                                fiveDaysIcon.textContent = '🌞';
                            } else if (weatherConditions == 'clouds') {
                                fiveDaysIcon.textContent = '🌤️'
                            } else if (weatherConditions == 'scaterred clouds' || weatherConditions == 'broken clouds') {
                                fiveDaysIcon.textContent = '☁️';
                            } else if (weatherConditions == 'thunderstorm') {
                                fiveDaysIcon.textContent = '⛈️';
                            } else if (weatherConditions == 'shower rain' || weatherConditions == 'rain') {
                                fiveDaysIcon.textContent = '🌧️'
                            }

                            // temperature data handling components
                            let fiveDaysTemp = data.daily[i].temp.day;

                            // converting from Kelvin to F
                            let tempConversion = (fiveDaysTemp - 273.15) * 9 / 5 + 32;
                            futureTemp.textContent = `Temperature: ${tempConversion.toFixed(1)} F`;


                            //  Humidity data handling component
                            let futureHumidity = data.daily[i].humidity;

                            displayFutureHumidity.textContent = `Humidity: ${futureHumidity} %`;


                            // wind Speed data handling component
                            let futureWind = data.daily[i].wind_speed;

                            displayFutureWind.textContent = `Wind-speed: ${futureWind} mph`;


                            //UV Index data handling component 
                            let futureUvIndex = data.daily[i].uvi;


                            let futureUvIndexFunc = function () {
                                displayFutureUvEl.textContent = `UV-index: ${futureUvIndex}`;

                            }
                            //Need to be able to override Css  
                            if (futureUvIndex >= 11) {
                                displayFutureUvEl.classList.add('custom-extreme-uvIndex');
                                futureUvIndexFunc();
                            } else if (futureUvIndex > 7 && futureUvIndex <= 10) {
                                displayFutureUvEl.classList.add('custom-vhigh-uvIndex');
                                futureUvIndexFunc();
                            } else if (futureUvIndex > 6 && futureUvIndex <= 7) {
                                displayFutureUvEl.classList.add('custom-uvIndex');
                                futureUvIndexFunc();
                            } else if (futureUvIndex > 3 && futureUvIndex <= 6) {
                                displayFutureUvEl.classList.add('custom-moderate-uvIndex');
                                futureUvIndexFunc();
                            } else if (futureUvIndex <= 3) {
                                displayFutureUvEl.classList.add('custom-low-uvIndex');
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
        week = 'Sunday';
    } else if (w == 1) {
        week = 'Monday';
    } else if (w == 2) {
        week = 'Tuesday';
    } else if (w == 3) {
        week = 'Wednesday';
    } else if (w == 4) {
        week = 'Thrusday';
    } else if (w == 5) {
        week = 'Friday';
    } else if (w == 6) {
        week = 'Saturday';
    }

    return week;
}





let localStorageHandling = function (cityName) {
    const cityList = {};
    
    
    let cities = JSON.parse(localStorage.getItem("cityList")) || [];
    cities.push(cityName);
    localStorage.setItem("cityList", JSON.stringify(cities));
    
}

let addCity = function(city){
    let createCity = document.createElement('button');
    createCity.textContent = city;
    createCity.setAttribute('type', 'submit');
    createCity.setAttribute('id', 'newButton');
    previousSearch.append(createCity);
    
    console.log(createCity);    
}

let previousSearches = function (){
    let cities = JSON.parse(localStorage.getItem("cityList")) || [];
    
    if(cities.length > 0){
        searchInputLocation(cities[cities.length - 1]);
    }
    
    for(let i = 0; i < cities.length; i++){
        addCity(cities[i]);
    }
    console.log(cities);
}
previousSearches();

userCardEl.addEventListener('click', formSubmitHandler);

