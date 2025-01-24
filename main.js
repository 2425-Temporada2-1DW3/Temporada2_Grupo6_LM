// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    // Selecciona el contenedor de la galería
    const galeria = document.querySelector(".mainGal");

    // Selecciona todas las imágenes de la galería
    const imagenes = document.querySelectorAll(".desplazamiento");

    // Selecciona el botón para ir hacia atrás
    const botonAtras = document.querySelector(".atrasbotom");

    // Selecciona el botón para ir hacia adelante
    const botonAdelante = document.querySelector(".adelantebotom");

    // Define el índice de la imagen actualmente visible (comienza en 0)
    let indiceActual = 0;

    // Función para mostrar la imagen actual basándose en el índice
    function mostrarImagen() {
        const anchoImagen = galeria.offsetWidth; // Obtén el ancho del contenedor dinámicamente
        console.log(`Ancho de la galería: ${anchoImagen}`); // Verificar el ancho
        const desplazamiento = -anchoImagen * indiceActual; // Calcula el desplazamiento correcto
        console.log(`Desplazamiento calculado: ${desplazamiento}`); // Depuración
        imagenes.forEach((img) => {
            img.style.transform = `translateX(${desplazamiento}px)`; // Desplaza las imágenes
        });
    }        

    let bloqueado = false; // Evita clics rápidos
    // Evento para manejar el clic en el botón de avanzar
    botonAdelante.addEventListener("click", () => {
        if (bloqueado) return; // Si está bloqueado, no hace nada
        bloqueado = true; // Bloquea clics adicionales
        if (indiceActual < imagenes.length - 1) {
            indiceActual++;
        } else {
            indiceActual = 0;
        }
        mostrarImagen();
        setTimeout(() => bloqueado = false, 500); // Desbloquea después de 500ms
    });
    
    botonAtras.addEventListener("click", () => {
        if (bloqueado) return; // Si está bloqueado, no hace nada
        bloqueado = true; // Bloquea clics adicionales
        if (indiceActual > 0) {
            indiceActual--;
        } else {
            indiceActual = imagenes.length - 1;
        }
        mostrarImagen();
        setTimeout(() => bloqueado = false, 500); // Desbloquea después de 500ms
    });
    
    // Ajusta el desplazamiento cuando la ventana cambia de tamaño
    window.addEventListener("resize", mostrarImagen);
});
