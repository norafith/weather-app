import { format } from "date-fns";
import ru from "date-fns/locale/ru";

let currTempInd = "celcius";

function renderWeather(forecastObj) {
  function renderCurrent() {
    const dateElem = document.querySelector("#curr-weather > .date");
    const weatherImgElem = document.querySelector(
      "#curr-weather > .weather-img"
    );
    const temperatureElem = document.querySelector(
      "#curr-weather > .temperature"
    );

    console.log(forecastObj);

    dateElem.textContent = format(
      new Date(forecastObj.current.last_updated),
      "d MMMM",
      {
        locale: ru,
      }
    );

    weatherImgElem.src =
      "http://" + forecastObj.current.condition.icon.slice(2);

    if (currTempInd == "celcius") {
      temperatureElem.textContent = forecastObj.current.temp_c;
      temperatureElem.classList.add("celcius");
    } else {
      temperatureElem.textContent = forecastObj.current.temp_f;
      temperatureElem.classList.add("fahrenheit");
    }
    temperatureElem.setAttribute(
      "data-temperature",
      `${forecastObj.current.temp_c} ${forecastObj.current.temp_f}`
    );

    const todayHourForecastElem = document.querySelector(
      "#today-hour-forecast"
    );
    for (let item of forecastObj.forecast.forecastday[0].hour) {
      createWeatherCard(
        todayHourForecastElem,
        item.time,
        item.condition.icon,
        [item.temp_c, item.temp_f],
        true
      );
    }
  }

  function createWeatherCard(
    parent,
    date,
    imgSrc,
    temperatureArr,
    hour = false
  ) {
    const weatherCard = document.createElement("div");
    weatherCard.classList.add("forecast-container");

    const dateElem = document.createElement("span");
    dateElem.classList.add("date");
    hour
      ? ((dateElem.textContent = format(new Date(date), "HH:mm")),
        {
          locale: ru,
        })
      : (dateElem.textContent = format(new Date(date), "d MMMM", {
          locale: ru,
        }));

    const weatherImgElem = document.createElement("img");
    weatherImgElem.src = "http://" + imgSrc.slice(2);
    weatherImgElem.classList.add("weather-img");

    const temperatureElem = document.createElement("span");
    temperatureElem.classList.add("temperature");
    let celciusTemp = temperatureArr[0],
      fahrTemp = temperatureArr[1];
    if (currTempInd == "celcius") {
      temperatureElem.textContent = celciusTemp;
      temperatureElem.classList.add("celcius");
    } else {
      temperatureElem.textContent = fahrTemp;
      temperatureElem.classList.add("fahrenheit");
    }

    temperatureElem.setAttribute(
      "data-temperature",
      `${temperatureArr[0]} ${temperatureArr[1]}`
    );

    parent.appendChild(weatherCard);
    weatherCard.appendChild(dateElem);
    weatherCard.appendChild(weatherImgElem);
    weatherCard.appendChild(temperatureElem);
  }

  function renderForecast() {
    const forecastMain = document.querySelector("#forecast-main");
    for (let item of forecastObj.forecast.forecastday) {
      createWeatherCard(forecastMain, item.date, item.day.condition.icon, [
        item.day.avgtemp_c,
        item.day.avgtemp_f,
      ]);
    }
  }

  async function renderLocationData() {
    const cityNameElem = document.querySelector("#city-name");
    const countryName = document.querySelector("#country-name");

    cityNameElem.textContent = forecastObj.location.name;
    countryName.textContent = forecastObj.location.country;
  }

  renderCurrent();
  renderForecast();
  renderLocationData();
}

function changeTempIndic() {
  currTempInd == "celcius"
    ? (currTempInd = "fahrenheit")
    : (currTempInd = "celcius");
  const temperatureElems = document.querySelectorAll(".temperature");
  temperatureElems.forEach((item) => {
    let tmpData = item.getAttribute("data-temperature").split(" ");
    if (currTempInd == "celcius") {
      item.textContent = tmpData[0];
      item.classList.add("celcius");
      item.classList.remove("fahrenheit");
    } else {
      item.textContent = tmpData[1];
      item.classList.add("fahrenheit");
      item.classList.remove("celcius");
    }
  });
}

function addListeners(paramHandler) {
  // data listeners
  const citySubmitBtn = document.querySelector("#city-submit");
  const cityInputElem = document.querySelector("#city-input");

  function localHandler() {
    if (cityInputElem.value < 1 || cityInputElem.value > 25) {
      alert("Длина введенного названия должна быть больше 1 и меньше 25.");
      return;
    }
    paramHandler(cityInputElem.value);
    cityInputElem.value = "";
  }

  citySubmitBtn.addEventListener("click", localHandler);

  cityInputElem.addEventListener("keydown", (e) => {
    if (e.code == "Enter") {
      localHandler();
    }
  });

  // animation listeners
  const changeTempElem = document.querySelector("#change-temp-value");
  const toggleCircle = document.querySelector("#toggle-circle");
  changeTempElem.addEventListener("click", () => {
    toggleCircle.classList.toggle("active");
    changeTempElem.classList.toggle("active");
    changeTempIndic();
  });

  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("mousedown", () => {
      button.classList.add("active");
    });
    button.addEventListener("mouseup", () => {
      button.classList.remove("active");
    });
    button.addEventListener("mouseleave", () => {
      button.classList.remove("active");
    });
  });
}

function clearForecast() {
  const forecastMainItems = document.querySelectorAll(
    "#forecast-main > .forecast-container"
  );
  const forecastMainCont = document.querySelector("#forecast-main");

  forecastMainItems.forEach((item) => {
    forecastMainCont.removeChild(item);
  });
}

export { renderWeather, addListeners, clearForecast };
