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

    var mymap = L.map("map").setView([40, -4], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
    }).addTo(mymap);

    // Llamar a la API de AEMET Open Data con tu clave
    var apiKeyAemet =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnZXJhcmRvbWFkcmlsaXN0YUBnbWFpbC5jb20iLCJqdGkiOiJiNzlmNjMzOC02NzdkLTRjZjgtOTUwNS1iMDc0ZTY1NWUwZGUiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTcwNjgzMTI5NSwidXNlcklkIjoiYjc5ZjYzMzgtNjc3ZC00Y2Y4LTk1MDUtYjA3RGU2NTVlMGRlIiwicm9sZSI6IiJ9.LJrACojrMknhDzo1PHsTf9eT-_U_3MtRV_cIoTCr9QQ";
    var apiUrlAemet =
        "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/";
    var ciudadCodigo = "28079";
    var requestUrlAemet = apiUrlAemet + ciudadCodigo + "?api_key=" + apiKeyAemet;

    // Obtener elementos del DOM
    const leyendaMapa = document.getElementById("leyenda-mapa");
    const mapaDiv = document.getElementById("mapa");

    // Eventos
    // Verifica que este elemento exista en tu HTML
    const fechaSelector = document.getElementById("fecha");
    const variableSelector = document.getElementById("variable");
    const actualizarMapaBtn = document.getElementById("actualizar-mapa");

    if (actualizarMapaBtn && fechaSelector && variableSelector) {
        actualizarMapaBtn.addEventListener("click", function () {
            var fecha = fechaSelector.value;
            var variable = variableSelector.value;
            obtenerDatosAEMET(ciudadCodigo, fecha, variable);
        });
    } else {
        console.error("Elementos no encontrados. Verifica tus IDs en el HTML.");
    }

    // Agregar capa base
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
    }).addTo(mymap);


    // API de AEMET OpenData
    var apiKeyAemet = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnZXJhcmRvbWFkcmlsaXN0YUBnbWFpbC5jb20iLCJqdGkiOiJiNzlmNjMzOC02NzdkLTRjZjgtOTUwNS1iMDc0ZTY1NWUwZGUiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTcwNjgzMTI5NSwidXNlcklkIjoiYjc5ZjYzMzgtNjc3ZC00Y2Y4LTk1MDUtYjA3RGU2NTVlMGRlIiwicm9sZSI6IiJ9.LJrACojrMknhDzo1PHsTf9eT-_U_3MtRV_cIoTCr9QQ";
    var apiUrlAemet = "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/";

    // Función para obtener datos de AEMET
    function obtenerDatosAEMET(ciudadCodigo, fecha, variable) {
        var requestUrlAemet = apiUrlAemet + ciudadCodigo + "?api_key=" + apiKeyAemet + "&fecha=" + fecha;
        fetch(requestUrlAemet)
            .then((response) => response.json())
            .then((data) => {
                // Procesar datos y mostrarlos en el panel
                var ciudad = data.datos[0].nombre;
                document.getElementById("ciudad").textContent = ciudad;
                var datosMeteorologicos = data.datos[0].prediccion[0].dia[0].variable[variable];
                mostrarDatosMeteorologicos(datosMeteorologicos);
            });
    }

    // Función para mostrar datos meteorológicos
    function mostrarDatosMeteorologicos(datos) {
        // Aquí se debe modificar el código para mostrar los datos de la variable seleccionada
        // Ejemplo para mostrar la temperatura
        var contenido = "<ul>";
        for (var i = 0; i < datos.length; i++) {
            contenido += "<li>Hora: " + datos[i].hora + " - Temperatura: " + datos[i].value + "ºC</li>";
        }
        contenido += "</ul>";
        document.getElementById("datos-meteorologicos").innerHTML = contenido;
    }

    // Eventos

    // Actualizar datos al cambiar la fecha




    document.getElementById("fecha").addEventListener("change", function () {
        var fecha = document.getElementById("fecha").value;
        var variable = document.getElementById("variable").value;
        obtenerDatosAEMET(ciudadCodigo, fecha, variable);
    });

    // Actualizar datos al cambiar la variable
    document.getElementById("variable").addEventListener("change", function () {
        var fecha = document.getElementById("fecha").value;
        var variable = document.getElementById("variable").value;
        obtenerDatosAEMET(ciudadCodigo, fecha, variable);
    });
    // Carga inicial
    obtenerDatosAEMET(ciudadCodigo, "2024-02-01", "temperatura");
});