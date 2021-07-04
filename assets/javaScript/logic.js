'use strict';
const userCardEl = document.querySelector('#custom-card');
const userInputEl = document.querySelector('#input-area');
const weatherNowEl = document.querySelector('#main-container');
const displayIcon = document.querySelector('#weather-icon');
const displayTemp = document.querySelector('#temperature');
const displayHumi = document.querySelector('#humidity');
const displayWindSpeed = document.querySelector('#wind-speed');
const displayUvIndex = document.querySelector('#uv-index');
const apiKey = 'f846e26f3aae4ab1fe222c8a837c3a9f'
const apiQueryUrl = 'api.openweathermap.org/data/2.5/weather?&appid=f846e26f3aae4ab1fe222c8a837c3a9'


let formSubmitHandler = function (event){
    event.preventDefault();
    let givenInput = userInputEl.value.trim().toLowerCase();
    
    if(givenInput){
        searchInputLocation(givenInput);
        userInputEl.textContent = '';
    }else{
        alert('Provide City to Search For!!')
    }
}


function searchInputLocation(givenInput) {
    let input = `https://api.openweathermap.org/data/2.5/weather?q=${ givenInput }&appid=${ apiKey }`;
    
    fetch(input)
        .then(function(response){
            if(response.ok){
                
                response.json()
                .then(function(data){
                    oneWeatherCall(data.coord.lat, data.coord.lon);
                })
            };
            
        });
        

};

let oneWeatherCall = function(lat, lon){
    let input2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // fetch data from one call api   
    fetch(input2)
    .then(function(response){
        // check response status
        if(response.ok){
            
            response.json()
            .then(function(data){
                console.log(data);
                //name, temperature humidity, wind speed, uv index 
                // city name handling components
                    let cityName = userInputEl.value.trim();                
                    let createCityEl = document.createElement('h4');
                    createCityEl.textContent = cityName;
                    weatherNowEl.append(createCityEl);
                    weatherNowEl.classList.remove('hidden');

                //Icon Handling component
                    
            
                // temperature data handling components
                    let getTemp = data.current.temp;
                    // converting from Kelvin to F
                    let currentTemp = (getTemp - 273.15) * 9/5 +32;                    
                    let currentTempEl = document.createElement('p');
                    currentTempEl.textContent = `Temperature: ${currentTemp.toFixed(1)} F`;
                    displayTemp.append(currentTempEl);
                    displayTemp.classList.remove('hidden');

                //  Humidity data handling component
                    let getHumidity = data.current.humidity;
                    let currentHumidityEl = document.createElement('p');                    
                    currentHumidityEl.textContent =`Humidity: ${getHumidity} %`;
                    console.log(currentHumidityEl)
                    displayHumi.append(currentHumidityEl);
                    
                // wind Speed data handling component
                    let getWind = data.current.wind_speed;
                    let currentWindEl = document.createElement('p');                    
                    currentWindEl.textContent =`Wind-speed: ${getWind} mph`;
                    displayWindSpeed.append(currentWindEl);

                //UV Index dta handling component 
                    let getUvIndex = data.current.uvi;
                    let currentUvEl = document.createElement('p');  
                    
                    let uvIndexFunc = function(){
                        currentUvEl.textContent =`UV-index: ${getUvIndex}`;
                        displayUvIndex.append(currentUvEl);
                        displayUvIndex.classList.remove('hidden');
                    }
                    //Need to be able to override Css  
                    if(getUvIndex >= 11){
                        currentUvEl.classList.add('custom-extreme-uvIndex');
                        uvIndexFunc();
                    }else if(getUvIndex >= 8 && getUvIndex <= 10){
                        currentUvEl.classList.add('custom-vhigh-uvIndex');
                        console.log('Damn override');
                        uvIndexFunc();
                    }else if(getUvIndex >= 6 && getUvIndex <= 7){
                        currentUvEl.classList.add('custom-uvIndex');
                        uvIndexFunc();
                    }else if(getUvIndex >= 3 && getUvIndex <= 5){
                        currentUvEl.classList.add('custom-moderate-uvIndex');
                        uvIndexFunc();
                    }else if(getUvIndex > 8 && getUvIndex < 10){
                        currentUvEl.classList.add('custom-low-uvIndex');
                        uvIndexFunc();
                    }
                    
            })
        };
    });
    

}

userCardEl.addEventListener('submit', formSubmitHandler);