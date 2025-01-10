<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
    <!-- Plantilla para la transformación del documento -->
    <xsl:template match="/">
        <html lang="es">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=1920, initial-scale=1.0"/>
                <title>RFEBM</title>
                <link rel="stylesheet" href="resources/css/styles.css"/>
                <link rel="stylesheet" href="resources/css/responsive.css"/>
                <link rel="shortcut icon" href="resources/images/favicon.png" type="image/x-icon"/>
                <link rel="stylesheet" href="resources/css/normalize.css"/>
                <script src="https://kit.fontawesome.com/77e72bf4fc.js" crossorigin="anonymous"></script>
                <link rel="stylesheet" href="resources/css/menuTempCalendario.css"/>
            </head>
            <body>
                <header>
                    <div class="headerGrid">
                        <div class="hg1"> <a href="index.html"><img src="resources/images/logo.svg" alt="Main Site Logo"/></a></div>
                        <div class="hg2"><a href="index.html" class="bigtitle">real federación española de balonmano</a><a href="index.html" class="smalltitle">rfebm</a></div>
                        <div class="hg3">
                            <nav>
                                <ul>
                                    <li><a href="#">Calendario</a>
                                        <div class="menu-desplegable">
                                            <a href="calendar_T1.html">temporada 1</a>
                                            <a href="calendar_T2.html">temporada 2</a>
                                            <a href="calendar_T3.html">temporada 3</a>
                                        </div>
                                    </li>
                                    <a href="equipos.html"> <li>  equipos       </li> </a>
                                    <a href="clasificacion.html">  <li>  clasificación </li> </a>
                                    <a href="galeria.html"> <li>  galería       </li> </a>
                                    <a href="contacto.html"><li>  contacto      </li> </a>
                                </ul>
                            </nav>
                        </div>
                    </div>     
                </header>
                <main>
                    <img class="mainImage" src="resources/images/mainImage.png" alt="imagen de decoracion"/>
                    <xsl:apply-templates select="calendario/mes"/>
                </main>
            </body>
        </html>
    </xsl:template>
    
    <!-- Plantilla para los meses y partidos -->
    <xsl:template match="mes">
        <div class="titleDefault">
            <xsl:value-of select="nombreMes"/>
        </div>
        <xsl:for-each select="partidos/partido">
            <div class="calendar">
                <div class="calendarDateText">
                    <xsl:value-of select="fecha"/>
                </div>
                <div class="calendarFieldText">
                    <xsl:value-of select="estadio"/>
                </div>
                <a href="equipos.html#{equipo1}">
                    <img src="resources/images/logosEquipos/{equipo1}.png" alt="Logo Equipo 1"/>
                </a>
                <div class="calendarTeam1">
                    <div class="calendarTextTeam1">
                        <xsl:value-of select="equipo1"/>
                    </div>
                </div>
                <div class="calendarVersusText">VS</div>
                <div class="calendarTeam2">
                    <div class="calendarTextTeam2">
                        <xsl:value-of select="equipo2"/>
                    </div>
                </div>
                <a href="equipos.html#{equipo2}">
                    <img src="resources/images/logosEquipos/{equipo2}.png" alt="Logo Equipo 2"/>
                </a>
                <div class="calendarHourText">
                    <xsl:value-of select="hora"/>
                </div>
            </div>
        </xsl:for-each>
    </xsl:template>

</xsl:stylesheet>