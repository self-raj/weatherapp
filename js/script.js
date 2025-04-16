const search_btn = document.querySelector(".search-btn");
const location_btn = document.querySelector(".location-btn");
const city_input = document.querySelector(".input-city");
const current_weather = document.querySelector(".current-weather");
const weather_cards = document.querySelector(".weather-cards");
const API_KEY = "504f22f88f010be56fd4f108e6375ac9"
const create_weather_card = (City_name, weather_item, index) => {
    if (index === 0) {
        return `
                <div class="details">
                    <h2>${City_name}(${weather_item.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weather_item.main.temp - 273.15).toFixed(2)}° C,</h4>
                    <h4>Wind:${weather_item.wind.speed}M/S</h4>
                    <h4>Humidity:${weather_item.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weather_item.weather[0].icon}@2x.png" alt="weather-icon">
                    <h4>${weather_item.weather[0].description}</h4>
                </div>

`
    }
         else {
                return `<li class="card">
                <h2>(${weather_item.dt_txt.split(" ")[0]})</h2>
                <img src="https://openweathermap.org/img/wn/${weather_item.weather[0].icon}@2x.png" alt="weather-icon">
                <h4>Temp: ${(weather_item.main.temp - 273.15).toFixed(2)}° C,</h4>
                <h4>Wind:${weather_item.wind.speed}M/S</h4>
                <h4>Humidity:${weather_item.main.humidity}%</h4>
                </li>`
    }

}



//  here call api

const weather_details = (City_name, lat, lon) => {
    const forecast_weather_url = `http://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${API_KEY}`

    fetch(forecast_weather_url)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {

            const unique_forecast = []
            const five_days_data = data.list.filter(forecast => {
                const firecast_data_fetch = new Date(forecast.dt_txt).getDate();
                if (!unique_forecast.includes(firecast_data_fetch)) {
                    return unique_forecast.push(firecast_data_fetch)
                }

            });

            // clear previous data
            city_input.innerHTML = "";
            current_weather.innerHTML = "";
            weather_cards.innerHTML = "";

        
            //  this code denotes dom manipulation create forecast card or current weather card 
            five_days_data.forEach((weather_item, index) => {
                if (index === 0) {
                    current_weather.insertAdjacentHTML("beforeend", create_weather_card(City_name, weather_item, index));
                }
                else {
                    weather_cards.insertAdjacentHTML("beforeend", create_weather_card(City_name, weather_item, index));
                }
            });

        })

        .catch(function (error) {
            console.log("Error fetching data:", error);
        });
}

 // this funcation find city name 

const get_city = async () => {
    const find_city = city_input.value.trim();
    if (!find_city) return;
    const location_api = `http://api.openweathermap.org/geo/1.0/direct?q=${find_city}&limit=1&appid=${API_KEY}`

    city_input.value = "";
    fetch(location_api)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (!data.length){
                alert(`Sorry, location "${find_city}" not found. Please enter a valid city name.`);
             return;}
          
            const { name, lat, lon } = data[0]
            weather_details(name, lat, lon)
            // console.log(data);
        })
        .catch(function (error) {
            console.log("Error fetching data:", error);
        });
            // console.log(location_api);
}



// this  funcation call current colation
const get_current_location = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            console.log(position);

            const { latitude, longitude } = position.coords;
            const reverse_url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

            fetch(reverse_url)
                .then(function (res) {
                    return res.json();
                })
                .then(function (data) {
                    const { name } = data[0]
                    weather_details(name, latitude, longitude)

                })
                .catch(function (error) {
                    console.log("Error fetching data:", error);
                });
        }),

        error => {
            console.error(error);
            if (error.code === error.PERMISSION_DENIDE) {
                alert("allow loction")
            }
        }
}



location_btn.addEventListener("click", get_current_location);
search_btn.addEventListener("click", get_city);
