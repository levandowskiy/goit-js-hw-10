import './css/styles.css';
import { fetchCountries } from './fetchCountries'
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const debounce = require('lodash.debounce');

const inputSearch = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list")
const countryInfo = document.querySelector(".country-info")
const DEBOUNCE_DELAY = 300;

inputSearch.addEventListener("input", debounce(handleCountrySearchInput, DEBOUNCE_DELAY));

function handleCountrySearchInput() {
    const inputValue = inputSearch.value.trim();
    const isEmptyInput = inputValue === "";

    if (isEmptyInput) {
        countryList.innerHTML = "";
        countryInfo.innerHTML = "";
        return
    }

    fetchCountries(inputValue)
        .then(countries => {
            const isValidRequest = checkNumberCountries(countries);

            if (isValidRequest) {
                makeCountryListMarkup(countries);
            }

            const foundCountry = countries.length === 1;

            if (foundCountry) {
                countryList.innerHTML = "";
                countryInfo.innerHTML = makeCardMarkup(countries[0])
            }
        })
        .catch(error => {
            countryList.innerHTML = "";
            countryInfo.innerHTML = "";
            if (error.message === "404") {
                Notiflix.Notify.failure("Oops, there is no country with that name");
            } else {
                Notiflix.Notify.failure(error.message);
            }
        });
}

function checkNumberCountries(countries) {
    if (countries.length > 10) {
        Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
        countryList.innerHTML = "";
        countryInfo.innerHTML = "";
        return false;
    }
    return true;
}

function makeCountryListMarkup(countries) {
    countryInfo.innerHTML = "";

    const countriesItems = countries.map(country => {
        const countryItem = document.createElement("li");
        const countryflagItem = document.createElement("img");
        const countryName = document.createElement("p")

        countryflagItem.setAttribute("src", country.flags.svg);
        countryflagItem.classList.add("flag-img")
        countryName.textContent = country.name.common;

        countryItem.appendChild(countryflagItem);
        countryItem.appendChild(countryName);

        return countryItem;
    });

    countryList.append(...countriesItems)
}

function makeCardMarkup(country) {
    return `<ul class="country-card-list">
        <li class="country-card-item"><img src="${country.flags.svg}"><h2 class="card-title">${country.name.common}</h2></li>
        <li class="country-card-item"><h3>Capital:</h2><p>${country.capital}</p></li>
        <li class="country-card-item"><h3>Population:</h2><p>${country.population}<p/></li>
        <li class="country-card-item"><h3>Languages:</h2><p>${Object.values(country.languages).join(", ")}</p></li>
        </ul>`;
}

