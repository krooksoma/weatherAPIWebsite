'use strict';

const inputFormEl = document.getElementById('input-area');
const searchButtonEl = document.querySelector('.search-Btn');
const mainDisplayEl = document.getElementById('main-container');
const fiveDaysEl = document.getElementById('five-days');
const apiKey = 'f846e26f3aae4ab1fe222c8a837c3a9'
const apiQueryUrl = 'api.openweathermap.org/data/2.5/weather?&appid=f846e26f3aae4ab1fe222c8a837c3a9'
console.log(inputFormEl.value);

function eventHandler(event){
    event.preventDefault();

    let givenInput = inputFormEl.value.trim().toLowerCase();
    console.log(givenInput);

    if(givenInput){
        searchInputLocation(givenInput);
        inputFormEl.textContent = '';
    }else{
        alert('Provide City to Search For!!')
    }
}


function searchInputLocation() {
    let input = "https://api.openweathermap.org/data/2.5/weather?q=" + givenInput + "&appid=" + apiKey;

    fetch(input)
        .then(function(response){
            if(response.ok){
                console.log(data);
                throw response.json();
            };
            return response.json();
        });
    

};

searchButtonEl.addEventListener('submit', eventHandler);