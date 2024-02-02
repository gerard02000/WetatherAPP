
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



    var map = L.map('map').setView([40, -4], 6);

    // Capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // API Key AEMET
    var apiKeyAemet = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnZXJhcmRvbWFkcmlsaXN0YUBnbWFpbC5jb20iLCJqdGkiOiJiNzlmNjMzOC02NzdkLTRjZjgtOTUwNS1iMDc0ZTY1NWUwZGUiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTcwNjgzMTI5NSwidXNlcklkIjoiYjc5ZjYzMzgtNjc3ZC00Y2Y4LTk1MDUtYjA3RGU2NTVlMGRlIiwicm9sZSI6IiJ9.LJrACojrMknhDzo1PHsTf9eT-_U_3MtRV_cIoTCr9QQ";

    // URL de la API AEMET
    var apiUrl = "https://opendata.aemet.es/opendata/api/mapasygraficos/mapassignificativos/fecha/2024-02-03/esp/d%2B0?api_key=" + apiKeyAemet;

    // Realizar la solicitud a la API AEMET
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Verificar si la respuesta es exitosa
            if (data.estado === 0) {
                // Procesar datos y mostrar el mapa
                var mapData = data.datos;
                // Aquí puedes usar los datos para personalizar tu mapa
                console.log(mapData);
            } else {
                console.error('Error en la solicitud a la API de AEMET:', data.descripcion);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud a la API de AEMET:', error);
        });
});

