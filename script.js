const api = {
  key: key(),
  base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

let searchBtn = document.getElementById('search-button')
searchBtn.addEventListener('click', function () {
  getResults(searchbox.value);
})

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=imperial&APPID=${api.key}`)
    .then(weather => {
      if (!weather.ok) {
        alert("Wrong City Name. Please Try Again");
        throw new Error("Wrong City Name. Please Try Again");
      }
      return weather.json();
    }).then(displayResults);
}

let locationBtn = document.getElementById('location-button')

locationBtn.addEventListener("click", () => {
  let lon;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lon = position.coords.longitude;
      lat = position.coords.latitude;

      const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=83e8cb8142cc1f0a9d79b868cbaee6cf`
      fetch(api).then((weather) => {
        if (!weather.ok) {
          alert("Wrong City Name. Please Try Again");
          throw new Error("Wrong City Name. Please Try Again");
        }
        return weather.json();
      }).then(displayResults);
    })
  } else {
    alert("Geolocation is not supported by this device");
  }
})

function displayResults(weather) {

  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°F</span>`;

  const iconId = weather.weather[0].icon;
  let iconElement = document.querySelector('.weather-icon');
  iconElement.innerHTML = `<img src="icons/${iconId}.png"/>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `High: ${Math.round(weather.main.temp_max)}°F / Low: ${Math.round(weather.main.temp_min)}°F`;
}

import { key } from './icons_dark/icons.js';

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}