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
      alert(`You are in ${city}, ${countryName}`);
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
/*
// Async/Await
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function (country) {
  // Geolocation
  const pos = await getPosition();
  const { latitude: lat, longitude: lng } = pos.coords;

  // Reverse geocoding API
  const resGeo = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude${lat}&longitude(${lng})`
  );
  const dataGeo = await resGeo.json();
  console.log(dataGeo);

  const res = await fetch(
    `https://restcountries.com/v3.1/name/${dataGeo.countryName}`
  );
  console.log(res);

  const data = await res.json();
  console.log(data);
  renderCountry(data[0]);
};
whereAmI();
console.log('FIRST');
*/
