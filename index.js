//contenido dinámico mediante JavaScript
$(document).ready(function () {
    const contenidoId = "#contenido"; // Selector del contenedor de contenido dinámico
    const errorMessage = "Error al cargar el contenido. Por favor, inténtalo de nuevo.";

    // Función para cargar contenido dinámico
    function cargarContenido(url) {
        $(contenidoId).html("<p>Cargando contenido...</p>");

        $.ajax({
            url: url,
            method: "GET",
            dataType: "html",
            success: function (data) {
                $(contenidoId).html(data);
            },
            error: function () {
                console.error("Error al cargar contenido:", url);
                $(contenidoId).html(`<p>${errorMessage}</p>`);
            },
        });
    }

    // Manejador para los clics en el menú
    function manejarClickEnMenu() {
        $("nav li, .hg1 a, .hg2 a, .menu-desplegable a").on("click", function (event) {
            event.preventDefault(); // Evitar la redirección por defecto del enlace
            const url = $(this).data("url");

            if (!url) {
                console.warn("El elemento no tiene una URL asociada.");
                return;
            }

            if ($(contenidoId).data("currentUrl") === url) {
                console.log("Contenido ya cargado:", url);
                return;
            }

            console.log("Cargando contenido desde:", url);
            $(contenidoId).data("currentUrl", url); // Guarda la URL actual
            cargarContenido(url);
        });
    }

    // Inicialización de la página
    function inicializarPagina() {
        const primerElementoUrl = $("nav li:first").data("url");
        if (primerElementoUrl) {
            cargarContenido(primerElementoUrl);
            $(contenidoId).data("currentUrl", primerElementoUrl);
        } else {
            console.warn("No se encontró una URL en el primer elemento del menú.");
        }
    }

    // Configuración inicial
    manejarClickEnMenu();
    inicializarPagina();
});
