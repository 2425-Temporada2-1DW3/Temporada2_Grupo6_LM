function inicializarCarrusel() {
    // Selección de elementos
    const galeria = document.querySelector(".mainGal");
    const imagenes = document.querySelectorAll(".desplazamiento");
    const botonAtras = document.querySelector(".atrasboton");
    const botonAdelante = document.querySelector(".adelanteboton");

    if (!galeria || !imagenes.length || !botonAtras || !botonAdelante) {
        return; // Sale de la función si faltan elementos
    }

    let indiceActual = 0; // Índice de la imagen actual
    let bloqueado = false; // Previene clics múltiples rápidos

    // Función para mostrar la imagen actual
    function mostrarImagen() {
        const anchoImagen = galeria.offsetWidth;
        const desplazamiento = -anchoImagen * indiceActual;
        imagenes.forEach((img) => {
            img.style.transform = `translateX(${desplazamiento}px)`;
        });
    }

    // Manejar clic en botón adelante
    botonAdelante.addEventListener("click", () => {
        if (bloqueado) return;
        bloqueado = true;
        if (indiceActual < imagenes.length - 1) {
            indiceActual++;
        } else {
            indiceActual = 0;
        }
        mostrarImagen();
        setTimeout(() => (bloqueado = false), 500);
    });

    // Manejar clic en botón atrás
    botonAtras.addEventListener("click", () => {
        if (bloqueado) return;
        bloqueado = true;
        if (indiceActual > 0) {
            indiceActual--;
        } else {
            indiceActual = imagenes.length - 1;
        }
        mostrarImagen();
        setTimeout(() => (bloqueado = false), 500);
    });

    // Ajustar carrusel en caso de redimensionar la ventana
    window.addEventListener("resize", mostrarImagen);

    // Muestra la primera imagen al cargar
    mostrarImagen();
}



function JugadoresTabla() {
    // Usar delegación de eventos para manejar los clics en los botones de jugadores
    document.body.addEventListener('click', function (event) {
        if (event.target.classList.contains('toggle-jugadores')) {
            const listaJugadores = document.querySelector(event.target.getAttribute('data-target'));

            // Alternamos la visibilidad de la lista de jugadores
            if (listaJugadores.style.display === 'none' || listaJugadores.style.display === '') {
                listaJugadores.style.display = 'block';
            } else {
                listaJugadores.style.display = 'none';
            }
        }
    });
}
// Inicializar después de que se cargue el contenido dinámico
$(document).on("ajaxComplete", function () {
    JugadoresTabla();
    inicializarCarrusel();
}); 