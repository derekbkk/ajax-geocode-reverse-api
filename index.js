'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const loader = document.querySelector('.loader');

const renderCountry = function (data, className = '') {
  // Country API object properties
  const flag = data.flags.svg;
  const countryName = data.name.common;
  const region = data.region;
  const population = (data.population / 1000000).toFixed(1);
  const language = Object.values(data.languages)[0];
  const currency = Object.values(data.currencies)[0].name;

  //HTML
  const html = `
      <article class="country ${className}">
        <img class="country__img" src="${flag}" />
        <div class="country__data">
          <h3 class="country__name">${countryName}</h3>
          <h4 class="country__region">${region}</h4>
          <p class="country__row"><span>👫</span>${population}m people</p>
          <p class="country__row"><span>🗣️</span>${language}</p>
          <p class="country__row"><span>💰</span>${currency}</p>
        </div>
      </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

// Error handling message
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  // countriesContainer.style.opacity = 1;
};

console.log('Getting location');

const getLocation = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
// getLocation().then(loc => console.log(loc));

const whereAmI = () => {
  getLocation()
    .then(loc => {
      const { latitude: lat, longitude: lng } = loc.coords;

      return fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
      );
    })
    .then(res => {
      if (!res.ok)
        throw new Error(`Problem with geocoding! Error ${res.status}!`);
      return res.json();
    })
    .then(data => {
      // console.log(data);
      const { city, countryName } = data;
      // alert(`You are in ${city}, ${countryName}`);
      console.log(`You are in ${city}, ${countryName}`);
      return fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    })
    .then(res => {
      if (!res.ok)
        throw new Error(`No country with this name! Error ${res.status}`);
      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err =>
      countriesContainer.insertAdjacentText('beforeend', `${err.message}`)
    )
    .finally(() => (countriesContainer.style.opacity = 1));
};

btn.addEventListener('click', whereAmI);

/////////////////////
// Old AJAX pre-ES6
/*
const getCountryAndNeighbor = function (country) {
  //ajax call primary country:
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();
  request.addEventListener('load', function () {
    // Parse JSON responseText to js object:
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    //render country:
    renderCountry(data);

    //get neighbor countries:
    const neighbors = data.borders;
    if (!neighbors) return;

    //ajax call neighboring countries:
    // loop all countries in data.borders array
    neighbors.forEach(neighbor => {
      const request2 = new XMLHttpRequest();
      request2.open(
        'GET',
        `https://restcountries.com/v3.1/alpha/${neighbor}
          `
      );
      request2.send();
      request2.addEventListener('load', function () {
        const [data2] = JSON.parse(this.responseText);
        // console.log(data2);

        //render country:
        renderCountry(data2, 'neighbor');
      });
    });
  });
};

getCountryAndNeighbor('usa');
*/
