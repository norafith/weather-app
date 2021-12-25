async function fetchWeather(city) {
  let data = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=a81690436961427abc094857212512&q=${city}&days=10&aqi=no&alerts=no`
  );
  data = await data.json();

  return data;
}

async function getUserLocation() {
  let response = await fetch("https://json.geoiplookup.io/");
  response = await response.json();
  return response.city;
}

export { fetchWeather, getUserLocation };
