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
                cargarXMLequipos(); // Llamamos a cargarXML después de insertar el contenido
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
            event.preventDefault();
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
            $(contenidoId).data("currentUrl", url);
            cargarContenido(url);
            inicializarCarrusel();
        });
    }

    // Inicialización de la página
    function inicializarPagina() {
        const urlLogoTitulo = $(".hg1 a").data("url") || $(".hg2 a.bigtitle").data("url");
        const url = urlLogoTitulo;

        if (url) {
            cargarContenido(url);
            $(contenidoId).data("currentUrl", url);
        } else {
            console.warn("No se pudo cargar la página inicial.");
        }
    }
    function cargarXMLequipos() {
        $.ajax({
            url: "liga_balonmano.xml",
            method: "GET",
            dataType: "xml",
            success: function (xml) {
                $(".selector-temporada").empty();
                $(".jugador-lista").empty();
    
                let primeraTemporada = null; // Variable para guardar la primera temporada
    
                $(xml).find("Temporada").each(function (index) {
                    let nombreTemporada = $(this).attr("nombre");
                    let idTemporada = $(this).attr("id");
                    let divTemporada = $("<div>").addClass("temporada").attr("id", idTemporada);
                    let botonTemporada = $("<button>").text(nombreTemporada).addClass("boton-temporada");
    
                    // Evento de clic para cargar jugadores
                    botonTemporada.on("click", function () {
                        cargarJugadoresPorTemporada(idTemporada, xml);
                        actualizarTituloTemporada(nombreTemporada)
                    });
    
                    divTemporada.append(botonTemporada);
                    $(".selector-temporada").append(divTemporada);
    
                    // Guardar la primera temporada
                    if (index === 0) {
                        primeraTemporada = { id: idTemporada, xml: xml };
                    }
                });
    
                // Si hay al menos una temporada, seleccionarla por defecto
                if (primeraTemporada) {
                    console.log("Seleccionando primera temporada por defecto:", primeraTemporada.id);
                    cargarJugadoresPorTemporada(primeraTemporada.id, primeraTemporada.xml);
                    $(".boton-temporada").first().addClass("seleccionado"); // Opcional: marcar botón seleccionado
                    actualizarTituloTemporada($(".boton-temporada").first().text());
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error cargando el XML: ", textStatus, errorThrown);
            }
        });
    }
    
    function cargarJugadoresPorTemporada(idTemporada, xml) {
        console.log("Cargando jugadores de la temporada:", idTemporada);
    
        // Limpiar todas las listas de jugadores antes de cargar nuevos
        $(".jugador-lista").empty();
    
        // Encontrar la temporada seleccionada en el XML
        let temporada = $(xml).find(`Temporada[id='${idTemporada}']`);
    
        if (temporada.length === 0) {
            console.warn("No se encontró la temporada con ID:", idTemporada);
            return;
        }
    
        // Buscar la plantilla de la temporada y cargar los jugadores
        let plantilla = temporada.find("Plantilla");
    
        plantilla.find("Jugador").each(function () {
            let datos = $(this).text().split(",");
            let nombre = `${datos[0]} ${datos[1]}`;
            let posicion = datos[4];
            let equipo = datos[5];
            let imagen = datos[6] ? `resources/${datos[6]}` : "resources/images/default.png";
    
            let claseEquipo = `.jugador-lista-${equipo.toLowerCase()}`;
    
            let listaJugadores = $(claseEquipo);
            if (listaJugadores.length === 0) {
                console.warn("No se encontró una lista de jugadores para el equipo:", equipo);
                return;
            }
    
            // Agregar jugador a la lista del equipo
            let jugadorHTML = `
                <div class="jugador">
                    <img src="${imagen}">
                    <p><strong>${nombre}</strong></p>
                    <p>Posición: ${posicion}</p>
                </div>
            `;
    
            listaJugadores.append(jugadorHTML);
        });
    }

    function actualizarTituloTemporada(nombreTemporada) {
        // Eliminar cualquier título previo
        $(".temporada-seleccionada").remove();
    
        // Crear un nuevo título con la temporada seleccionada
        let titulo = $("<h2>").addClass("temporada-seleccionada").text("Temporada: " + nombreTemporada);
    
        // Agregar el título al contenedor (puedes elegir el contenedor adecuado para mostrarlo)
        $(".titulo-temporada").empty().append(titulo);  // Asegúrate de tener un contenedor con la clase "titulo-temporada" en tu HTML
    }
    
    // Configuración inicial
    manejarClickEnMenu();
    inicializarPagina();
    inicializarCarrusel();
    cargarXMLequipos(); // Llama a la función para cargar el XML
});
