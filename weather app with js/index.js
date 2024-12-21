const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchform]");
const loadingScreen = document.querySelector(".loading-container");
const userinfoContainer = document.querySelector(".user-info-container");

let oldTab = userTab;
const apiKey = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getFormSessionStorage();

function switchtab(newTab) {
  if (newTab !== oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userinfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userinfoContainer.classList.remove("active");
      getFormSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  switchtab(userTab);
});
searchTab.addEventListener("click", () => {
  switchtab(searchTab);
});

function getFormSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinate");
  if (!localCoordinates) {
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  grantAccessContainer.classList.remove("active");
  loadingScreen.classList.add("active");

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userinfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    console.error(err);
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector("[data-cityname]");
  const countryIcon =document.querySelector("[data-countryicon]")
  const desc = document.querySelector("[data-weatherdesc]");
  const weatherIcon =document.querySelector("[data-weathericon]")
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudness]");

  cityName.innerText = weatherInfo?.name;
  countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`
  temp.innerText = `${weatherInfo?.main?.temp}°C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, handleLocationError);
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinate", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

function handleLocationError() {
  alert("Unable to retrieve your location. Please enable location services and try again.");
}

const grantAccessButton = document.querySelector("[data-grantaccess]");
grantAccessButton.addEventListener("click", getLocation);

let searchInput = document.querySelector("[data-searchinput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value.trim();
  if (cityName === "") return;
  fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userinfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userinfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
    console.error(err);
  }
}
