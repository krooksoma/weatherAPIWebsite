'use strict';
const userCardEl = document.querySelector('#custom-card');
const userInputEl = document.querySelector('#input-area');
const weatherNowEl = document.querySelector('#main-container');
const displayIcon = document.querySelector('#weather-icon');
const futureForecast = document.querySelector('#five-days');

const displayTemp = document.querySelector('#temperature');
const displayHumi = document.querySelector('#humidity');
const displayWindSpeed = document.querySelector('#wind-speed');
const displayUvIndex = document.querySelector('#uv-index');
const previousSearch = document.querySelector('#side-container');

const apiKey = 'f846e26f3aae4ab1fe222c8a837c3a9f'
const apiQueryUrl = 'api.openweathermap.org/data/2.5/weather?&appid=f846e26f3aae4ab1fe222c8a837c3a9'


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

                            futureTemp.textContent = '';
                            displayFutureHumidity.textContent = '';
                            displayFutureWind.textContent = '';
                            displayFutureUvEl.textContent = '';


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


    // let localStorageHandling = function () {

    //     let storedHistory = localStorage.getItem('City') || [];
    //     let newCity = userInputEl.value.trim();
    //     let newArray = [];
    //     newArray.push(newCity)
    //     newArray.push(storedHistory);
    //     localStorage.setItem('City', newArray);


    //     for(let i = 0; i< localStorage.length;i++){

    //         let searchBtn = document.createElement('button');
    //         searchBtn.setAttribute('type', 'submit');
    //         searchBtn.classList.add('search-Btn', 'col-12', 'm-2', 'p-2');
    //         searchBtn.textContent = i;
    //         previousSearch.append(searchBtn);

    //     }


    // }
    // localStorageHandling();
}




userCardEl.addEventListener('submit', formSubmitHandler);