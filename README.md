# CineSpot

Explorador de 37 películas y series. Usa Vue 3 por CDN, JavaScript, HTML y CSS. El catálogo se carga desde un arreglo local y los favoritos se guardan en el navegador con `localStorage`.

## Ejecutar el proyecto

1. Clona este repositorio y abre la carpeta en Visual Studio Code.
2. Abre `index.html` con Live Server. También puedes servir la carpeta con `python -m http.server 5500` y abrir `http://localhost:5500`.
3. Mantén la conexión a internet para cargar Vue desde el CDN. El proyecto no requiere instalar paquetes ni configurar un servidor de aplicaciones.

## Componentes

- `SearchBar` emite el texto de búsqueda y permite limpiarlo.
- `FilterToolbar` emite los cambios de formato, género y ordenamiento.
- `MediaCard` muestra el póster, el título y el género. Emite eventos para abrir la ficha, filtrar por género o cambiar el estado de favorito.
- `DetailModal` muestra la sinopsis, el año, la duración o las temporadas y los títulos relacionados.
- `app.js` mantiene el estado reactivo con `ref` y calcula los resultados y la lista de favoritos con `computed`.

## Demostración

Busca un título, combina filtros y abre su ficha. Marca su estrella y abre **Favoritos** desde la cabecera. Recarga la página para comprobar que el título sigue guardado y desmárcalo desde esa sección.
