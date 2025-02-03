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
                cargarXML(); // Llamamos a cargarXML después de insertar el contenido
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
    function manejarClickDeEquipos() {
        $(".enlaceLocal, .enlaceVisitante").on("click", function (event) {
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
    function cargarXML() {
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
                        cargarJornadas(idTemporada, xml);
                        cargarClasificacion(idTemporada, xml);
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
                    cargarJornadas(primeraTemporada.id, primeraTemporada.xml);
                    cargarClasificacion(primeraTemporada.id, primeraTemporada.xml);
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
    function cargarJornadas(idTemporada, xml) {
        let temporada = $(xml).find(`Temporada[id='${idTemporada}']`);
        if (temporada.length === 0) {
            console.warn("No se encontró la temporada con ID:", idTemporada);
            return;
        }
    
        // Obtener la fecha de la temporada (formato "2023-2024")
        let fechaTemporada = temporada.attr("fecha");
        let [añoInicio, añoFin] = fechaTemporada.split("-").map(Number);
    
        // Inicializamos la fecha de inicio en Octubre del año de inicio
        let fechaInicio = new Date(añoInicio, 9, 1); // Comenzamos en OCTUBRE (mes 9)
        
        // Definimos los polideportivos para cada equipo
        let polideportivos = {
            "Barcelona": "Polideportivo MAP",
            "Madrid": "Gregorio Marañón",
            "Murcia": "Arena's Arena",
            "Cáceres": "Polideportivo Rios",
            "Bilbao": "Patxi Aguirre",
            "Sevilla": "Illo's Arena"
        };
        
        // Iteramos por cada jornada
        for (let jornadaNum = 1; jornadaNum <= 10; jornadaNum++) {
            let jornada = temporada.find(`Jornada_${jornadaNum}`);
            if (jornada.length === 0) continue; // Si no hay jornada, saltamos
            
            let partidos = jornada.find("Partido");
            let resultados = jornada.find("Resultado");
    
            let jornadaContainer = $(`.calendar_${jornadaNum}`);
            if (jornadaContainer.length === 0) {
                console.warn(`No se encontró el contenedor para jornada ${jornadaNum}`);
                continue;
            }
    
            jornadaContainer.empty();
    
            // Generamos el título con el mes y el año dinámicos
            let mesActual = fechaInicio.getMonth();
            let anioActual = fechaInicio.getFullYear();
            let meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    
            // En vez de añadir un nuevo título, actualizamos el ya existente
            let titleContainer = jornadaContainer.prev('.titleDefault'); // Buscamos el contenedor previo con la clase .titleDefault
            if (titleContainer.length === 0) {
                // Si no existe, creamos uno nuevo
                titleContainer = $(`<div class="titleDefault">${meses[mesActual]} ${anioActual}</div>`);
                jornadaContainer.before(titleContainer);
            } else {
                // Si ya existe, simplemente actualizamos el texto
                titleContainer.text(`${meses[mesActual]} ${anioActual}`);
            }
    
            fechaInicio.setMonth(mesActual + 1);
            if (fechaInicio.getMonth() === 0) {
                fechaInicio.setFullYear(anioActual + 1); // Si pasamos a enero, sumamos un año
            }
    
            // Mostrar los partidos de la jornada
            partidos.each(function (index) {
                if (index >= 3) return false; // Solo mostramos los primeros 3 partidos
    
                let datosPartido = $(this).text().split(",");
                let nombreLocal = datosPartido[0].trim();
                let nombreVisitante = datosPartido[1].trim();
    
                let golesLocal = "N/A";
                let golesVisitante = "N/A";
    
                // Si hay resultados disponibles, los agregamos
                if (index < resultados.length) {
                    let datosResultado = $(resultados[index]).text().split(",");
                    golesLocal = datosResultado[0]?.trim() || "N/A";
                    golesVisitante = datosResultado[1]?.trim() || "N/A";
                }
    
                // Fechas y horarios de los partidos
                let fechas = ["JUE. 24", "LUN. 28", "MIÉ. 30"];
                let horas = ["17:00", "16:00", "19:00"];
    
                // Asignamos el polideportivo dependiendo del equipo local
                let polideportivo = polideportivos[nombreLocal] || "Polideportivo No Definido";
    
                // Generamos el HTML para el partido
                let partidoHTML = `
                    <div class="calendar">
                        <div class="calendarDateText">${fechas[index]} ${meses[mesActual]}</div>
                        <div class="polideportivo${index + 1} polideportivo">${polideportivo}</div>
                        <a class="enlaceLocal" href="javascript:void(0);" data-team="${nombreLocal.toLowerCase()}">
                            <img class="imagenLocal" src="resources/images/logosEquipos/${nombreLocal.toLowerCase()}.png" alt="Logo ${nombreLocal}">
                        </a>
                        <div class="calendarVersusText">${nombreLocal} vs ${nombreVisitante}</div>
                        <a class="enlaceVisitante" href="javascript:void(0);" data-team="${nombreVisitante.toLowerCase()}">
                            <img class="imagenVisitante" src="resources/images/logosEquipos/${nombreVisitante.toLowerCase()}.png" alt="Logo ${nombreVisitante}">
                        </a>            
                        <div class="calendarHourText">${horas[index]}</div>
                        <div class="resultado">Resultado: ${golesLocal} - ${golesVisitante}</div>
                    </div>
                `;
    
                // Añadir el partido al contenedor de la jornada
                jornadaContainer.append(partidoHTML);
            });
        }
    }
    function cargarClasificacion(idTemporada, xml) {
        // Obtener el contenedor de la tabla de clasificación
        let clasificacionContainer = $("#cuerpoClasificacion");
    
        // Limpiar el contenedor antes de cargar los nuevos datos
        clasificacionContainer.empty();
    
        // Buscar la temporada con el id correspondiente
        let temporadaSeleccionada = $(xml).find("Temporada").filter(function() {
            return $(this).attr("id") === idTemporada;
        });
    
        // Si encontramos la temporada, cargamos su clasificación
        if (temporadaSeleccionada.length > 0) {
            let temporada = temporadaSeleccionada.first();
            let nombreTemporada = temporada.attr("nombre");
    
            // Crear un título para la temporada seleccionada
            clasificacionContainer.append(`<h3>${nombreTemporada}</h3>`);
    
            // Crear una tabla para la temporada
            let tabla = $("<table>").addClass("tabla-clasificacion");
            let thead = $("<thead>").append("<tr><th colspan=2>Club</th><th>Puntos</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th></tr>");
            let tbody = $("<tbody>");
    
            // Leer los equipos de la clasificación de la temporada
            temporada.find("Clasificacion > Equipo").each(function(index) {
                if (index === 0) return; // Saltar la primera fila (cabecera en el XML)
    
                let datos = $(this).text().split(",");
                let fila = $("<tr>");
    
                // Asumimos que el primer dato es el nombre del equipo
                let nombreEquipo = datos[0].toLowerCase();  // Convertimos el nombre a minúsculas
    
                // Crear una celda para el escudo del equipo
                let celdaEscudo = $("<td>");
                let imgEscudo = $("<img>").attr("src", `resources/images/logosEquipos/${nombreEquipo}.png`).addClass("escudo-equipo");
                celdaEscudo.append(imgEscudo);
    
                // Crear una celda para el nombre del equipo
                let celdaNombreEquipo = $("<td>").text(datos[0]);
    
                // Añadir las celdas para el nombre y el escudo
                fila.append(celdaEscudo);
                fila.append(celdaNombreEquipo);
    
                // Añadir las celdas de los datos restantes
                for (let i = 1; i < datos.length; i++) {
                    fila.append(`<td>${datos[i]}</td>`);
                }
    
                tbody.append(fila);
            });
    
            // Añadir la tabla al contenedor
            tabla.append(thead).append(tbody);
            clasificacionContainer.append(tabla);
        }
    }
    // Configuración inicial
    manejarClickEnMenu();
    manejarClickDeEquipos();
    inicializarPagina();
    inicializarCarrusel();
    cargarXML(); // Llama a la función para cargar el XML
});
