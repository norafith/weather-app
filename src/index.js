import "./index.css";
import { fetchWeather, getUserLocation } from "./apiRequests";
import { renderWeather, addListeners, clearForecast } from "./domStuff";
import translate from "translate";

function handler(city) {
  clearForecast();

  fetchWeather(city)
    .then((data) => renderWeather(data))
    .catch((err) => {
      alert(err.message);
    });
}

window.onload = getUserLocation()
  .then((city) => {
    return translate(city, "ru").catch(() => {
      alert("Перевод локации не удался.");
      return city;
    });
  })
  .then((city) => handler(city));
addListeners(handler);
