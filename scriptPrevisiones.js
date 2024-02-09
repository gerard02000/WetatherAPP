document.addEventListener("DOMContentLoaded", function () {
    let isDark = false;

    // Theme setup
    const colors = [
        "hsl(345, 80%, 50%)",
        "hsl(100, 80%, 50%)",
        "hsl(200, 80%, 50%)",
        "hsl(227, 66%, 55%)",
        "hsl(26, 80%, 50%)",
        "hsl(44, 90%, 51%)",
        "hsl(280, 100%, 65%)",
        "hsl(480, 100%, 25%)",
        "hsl(180, 100%, 25%)",
    ];

    // Verificar si el botón de modo oscuro existe en la página antes de agregar el evento
    const darkModeBtn = document.querySelector(".dark-mode-btn");
    if (darkModeBtn) {
        darkModeBtn.addEventListener("click", handleDarkModeButtonClick);
    }

    // Initial setup
    getTheme();

    // Function to handle dark mode button click
    function handleDarkModeButtonClick() {
        const targetColor = isDark ? colors[3] : "#000";
        changeTheme(targetColor);
        isDark = !isDark;
    }

    function changeTheme(color) {
        document.documentElement.style.setProperty("--primary-color", color);

        // Cambiar el color del ícono de la luna
        const moonIcon = document.querySelector(".fas.fa-moon");
        if (moonIcon) {
            moonIcon.style.color = color; // Ajusta el color según tus necesidades
        }

        saveTheme(color);
    }

    const colorBtns = document.querySelectorAll(".theme-color");

    function saveTheme(color) {
        localStorage.setItem("theme", color);
    }

    function getTheme() {
        const theme = localStorage.getItem("theme");
        if (theme) {
            changeTheme(theme);
            isDark = theme === colors[7];
        }
    }

    const openWeatherMapApiKey = 'f2e7b973d010d97bf975e9a827e9b370'; // Clave de API de OpenWeatherMap
    const weatherbitApiKey = '0f8dfe824d464e92a4bdd14ec408c1b6'; // Clave de API de Weatherbit

    // Llamar a collectData cuando la página carga o cuando se hace clic en el botón de búsqueda
    collectData();
    document.getElementById('search-btn').addEventListener('click', collectData);

    function getWeather(apiKey, city) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(weatherData => {
                displayWeather(weatherData);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function displayWeather(data) {
        const weatherInfoContainer = document.querySelector('.weather-info');
        weatherInfoContainer.innerHTML = '';

        if (data.main && data.weather) {
            const temperature = data.main.temp - 273.15; // Convertir de Kelvin a Celsius
            const description = data.weather[0].description;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const minTemperature = data.main.temp_min - 273.15;
            const maxTemperature = data.main.temp_max - 273.15;
            const pressure = data.main.pressure;
            const visibility = data.visibility;
            const sunriseTimestamp = data.sys.sunrise;
            const sunsetTimestamp = data.sys.sunset;

            const weatherInfo = document.createElement('div');
            weatherInfo.classList.add('weather-info-box'); // Agregar una clase para el estilo del cuadro
            weatherInfo.innerHTML = `
                <p class="weather-info-text"><i class="fas fa-thermometer-half"></i> Temperature: ${temperature.toFixed(2)} °C</p>
                <p class="weather-info-text"><i class="fas fa-cloud"></i> Description: ${description}</p>
                <p class="weather-info-text"><i class="fas fa-tint"></i> Humidity: ${humidity}%</p>
                <p class="weather-info-text"><i class="fas fa-wind"></i> Wind Speed: ${windSpeed} m/s</p>
                <p class="weather-info-text"><i class="fas fa-temperature-low"></i> Min Temperature: ${minTemperature.toFixed(2)} °C</p>
                <p class="weather-info-text"><i class="fas fa-temperature-high"></i> Max Temperature: ${maxTemperature.toFixed(2)} °C</p>
                <p class="weather-info-text"><i class="fas fa-tachometer-alt"></i> Pressure: ${pressure} hPa</p>
                <p class="weather-info-text"><i class="fas fa-eye"></i> Visibility: ${visibility / 1000} km</p>
                <p class="weather-info-text"><i class="fas fa-sun"></i> Sunrise: ${formatTimestamp(sunriseTimestamp)}</p>
                <p class="weather-info-text"><i class="fas fa-moon"></i> Sunset: ${formatTimestamp(sunsetTimestamp)}</p>
            `;

            weatherInfoContainer.appendChild(weatherInfo);

            // Mostrar previsión del tiempo para los próximos 3 días utilizando Weatherbit
            if (data.coord) {
                getWeatherbitForecast(weatherbitApiKey, data.coord.lat, data.coord.lon);
            }
        } else {
            weatherInfoContainer.innerHTML = '<p>No se encontraron datos de clima.</p>';
        }
    }

    function collectData() {
        const cityInput = document.getElementById('city-input');
        const city = cityInput.value.trim();

        if (city !== '') {
            getWeather(openWeatherMapApiKey, city);
        } else {
            console.error('Error: Campo de ciudad vacío');
            // Puedes proporcionar retroalimentación al usuario aquí, por ejemplo, mostrar un mensaje de error en la página.
        }
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const formattedTime = hours + ':' + minutes.substr(-2);
        return formattedTime;
    }

    function getWeatherbitForecast(apiKey, lat, lon) {
        const forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${apiKey}`;

        fetch(forecastUrl)
            .then(response => response.json())
            .then(forecastData => {
                displayWeatherbitForecast(forecastData);
            })
            .catch(error => {
                console.error('Error fetching Weatherbit forecast:', error);
            });
    }

    function displayWeatherbitForecast(forecastData) {
        const forecastItems = document.querySelectorAll('.forecast-info .forecast-item');

        if (!forecastItems || forecastItems.length < 3) {
            console.error('Error: No se encontraron elementos de la previsión.');
            return;
        }

        // Obtener la fecha actual y calcular los próximos tres días
        const today = new Date();
        const nextThreeDays = [];
        for (let i = 1; i <= 3; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);
            nextThreeDays.push(nextDay);
        }

        // Verificar si hay suficientes elementos .forecast-item
        if (forecastItems.length >= 3) {
            for (let i = 0; i < 3; i++) {
                const forecastItem = forecastItems[i];
                const forecast = forecastData.data[i];

                if (forecast) {
                    const date = nextThreeDays[i];
                    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const temperatureMin = forecast.min_temp;
                    const temperatureMax = forecast.max_temp;
                    const description = forecast.weather.description;
                    const iconCode = forecast.weather.icon;
                    const precipitation = forecast.precip;

                    // Mostrar la información de la previsión para cada día
                    forecastItem.innerHTML = `
                        <p>${dayOfWeek}</p>
                        <p>Min: ${temperatureMin.toFixed(2)} °C</p>
                        <p>Max: ${temperatureMax.toFixed(2)} °C</p>
                        <p>${description}</p>
                        <p>Precipitación: ${precipitation.toFixed(2)} mm</p>
                        <img src="https://www.weatherbit.io/static/img/icons/${iconCode}.png" alt="Weather Icon">
                    `;
                } else {
                    console.error('Error: No se encontraron datos de previsión para el día ' + (i + 1));
                    forecastItem.innerHTML = '<p>No se encontraron datos de previsión.</p>';
                }
            }
        } else {
            console.error('Error: No hay suficientes elementos .forecast-item.');
        }
    }

    // JavaScript para habilitar/deshabilitar elementos de navegación
    const navigationIcons = document.querySelector('.navigation-icons');
    const navigation = document.querySelector('.navigation');

    // Función para habilitar/deshabilitar elementos de navegación según el tamaño de la pantalla
    function toggleNavigation() {
        if (window.innerWidth <= 600) {
            navigationIcons.style.display = 'flex'; // Mostrar iconos de navegación
            navigation.style.display = 'none'; // Ocultar navegación tradicional
        } else {
            navigationIcons.style.display = 'none'; // Ocultar iconos de navegación
            navigation.style.display = 'block'; // Mostrar navegación tradicional
        }
    }

    // Llamar a la función al cargar la página y al cambiar el tamaño de la ventana
    toggleNavigation();
    window.addEventListener('resize', toggleNavigation);





});
