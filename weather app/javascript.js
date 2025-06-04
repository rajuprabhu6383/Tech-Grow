const apikey = "cd7a078c43ef5c0dd3f1d4827ad98896"; /* Api Id For weatherCheck */

const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";



const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");


async function checkWeather(city_name) {
    const responce = await fetch(apiUrl + city_name + `&appid=${apikey}`);

    if (responce.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.querySelector(".weather-img img").style.display = "none";
        document.querySelector(".weather-img p").style.display = "none";
    }
    else {
        var data = await responce.json();

        document.querySelector(".city_name").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) +
            "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";




        /* img changes for each weather conditions */

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images_weather/clouds.png"
        }
        /* Snow */
        else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images_weather/clear.png"
        }
        else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images_weather/drizzle.png"
        }
        else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images_weather/mist.png"
        }
        else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images_weather/rain.png"
        }

        /* end images */


        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
        document.querySelector(".weather-img img").style.display = "none";
        document.querySelector(".weather-img p").style.display = "none";
    }

}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
})


