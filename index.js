$(document).ready(function () {
    function cargarContenidos(url) {
        $.ajax({
            url: url,
            method: "GET",
            dataType: "html",
            success: function (data) {
                $("#contenido").html(data); // Reemplaza el contenido de #contenido
            },
            error: function (xhr, status, error) {
    console.error("Error al cargar contenido:", error);
    $("#contenido").html("<p>Error al cargar el contenido.</p>");
}
        });
    }

    // Evento para cargar contenido al hacer clic en los enlaces del menú
    $('nav li').on('click', function () {
        var url = $(this).data('url');
        console.log("Cargando contenido desde: ", url); // Depuración
        cargarContenidos(url);
    });

    // Cargar contenido inicial (primer elemento del menú)
    cargarContenidos($('nav li:first').data('url'));
});