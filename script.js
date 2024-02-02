const wrapper = document.querySelector(".wrapper");
const inputPart = document.querySelector(".input-part");
const infoTxt = inputPart.querySelector(".info-txt");
const inputField = inputPart.querySelector("input");
const locationBtn = inputPart.querySelector("button");
const weatherPart = wrapper.querySelector(".weather-part");
const wIcon = weatherPart.querySelector("img");
const arrowBack = wrapper.querySelector("header i");

let api;
const apiKey = "f2e7b973d010d97bf975e9a827e9b370";
let isDark = false;

// Event listeners
inputField.addEventListener("keyup", handleInputKeyup);
locationBtn.addEventListener("click", handleLocationButtonClick);
arrowBack.addEventListener("click", handleArrowBackClick);

// Theme setup
const colors = ["hsl(345, 80%, 50%)",
    "hsl(100, 80%, 50%)",
    "hsl(200, 80%, 50%)",
    "hsl(227, 66%, 55%)",
    "hsl(26, 80%, 50%)",
    "hsl(44, 90%, 51%)",
    "hsl(280, 100%, 65%)",
    "hsl(480, 100%, 25%)",
    "hsl(180, 100%, 25%)",];
const darkModeBtn = document.querySelector(".dark-mode-btn");
if (darkModeBtn) {
    darkModeBtn.addEventListener("click", handleDarkModeButtonClick);
}
// Initial setup
getTheme();

// Functions
function handleInputKeyup(e) {
    if (e.key === "Enter" && inputField.value.trim() !== "") {
        requestWeatherByCity(inputField.value.trim());
    }
}

function handleLocationButtonClick() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        showError("Your browser does not support geolocation API");
    }
}

function requestWeatherByCity(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error) {
    showError(error.message);
}

function fetchData() {
    showPendingMessage("Getting weather details...");
    fetch(api)
        .then(handleFetchResponse)
        .then(weatherDetails)
        .catch(handleFetchError);
}

function handleFetchResponse(res) {
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}

function handleFetchError() {
    showError("Something went wrong");
}

function weatherDetails(info) {
    if (info.cod === "404") {
        showError(`${inputField.value} isn't a valid city name`);
    } else {
        const { name, sys, weather, main } = info;
        const { description, id } = weather[0];
        const { temp, feels_like, humidity } = main;

        setWeatherIcon(id);
        setWeatherContent(name, sys.country, description, temp, feels_like, humidity);
        clearMessages();
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

function setWeatherIcon(id) {
    const iconSrc = getWeatherIcon(id);
    wIcon.src = iconSrc;
}

function getWeatherIcon(id) {
    if (id === 800) return "icons/clear.svg";
    if (id >= 200 && id <= 232) return "icons/storm.svg";
    if (id >= 600 && id <= 622) return "icons/snow.svg";
    if (id >= 701 && id <= 781) return "icons/haze.svg";
    if (id >= 801 && id <= 804) return "icons/cloud.svg";
    if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) return "icons/rain.svg";
}

function setWeatherContent(city, country, description, temp, feels_like, humidity) {
    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
}

function handleArrowBackClick() {
    wrapper.classList.remove("active");
}

// Function to handle dark mode button click
function handleDarkModeButtonClick() {
    // Desmarcar todos los botones de la paleta de colores
    colorBtns.forEach((btn) => {
        btn.classList.remove("selected");
    });

    const targetColor = isDark ? colors[3] : "#000";
    changeTheme(targetColor);
    isDark = !isDark;
}

function changeTheme(color) {
    document.documentElement.style.setProperty("--primary-color", color);

    // Cambiar el color del ícono de la luna
    const moonIcon = document.querySelector(".bx-moon");
    if (moonIcon) {
        moonIcon.style.color = color; // Ajusta el color según tus necesidades
    }

    saveTheme(color);
}


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

function showError(message) {
    infoTxt.innerText = message;
    infoTxt.classList.replace("pending", "error");
}

function showPendingMessage(message) {
    infoTxt.innerText = message;
    infoTxt.classList.add("pending");
}

function clearMessages() {
    infoTxt.innerText = "";
    infoTxt.classList.remove("pending", "error");
}


const colorBtns = document.querySelectorAll(".theme-color");

// Loop through colors array and set each color to a button
for (let i = 0; i < colorBtns.length; i++) {
    colorBtns[i].style.backgroundColor = colors[i];
}

colorBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        // Cambiar el estilo de la página
        changeTheme(btn.style.backgroundColor);

        // Cambiar el color del span seleccionado a verde
        colorBtns.forEach((otherBtn) => {
            if (otherBtn !== btn) {
                otherBtn.classList.remove("selected");
            }
        });
        btn.classList.add("selected");
    });
});




//aplicacion del tiempo 
const elements = document.querySelectorAll('.element');
let currentIndex = 0;

function showNextElement() {
    elements[currentIndex].classList.remove('visible');
    currentIndex = (currentIndex + 1) % elements.length;
    elements[currentIndex].classList.add('visible');
}

// Llama a la función para mostrar el primer elemento
showNextElement();

// Configura un temporizador para mostrar el próximo elemento cada 3000 milisegundos (3 segundos)
setInterval(showNextElement, 3000);



