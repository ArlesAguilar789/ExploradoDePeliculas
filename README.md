# Big Cinema — Archivo y Explorador Audiovisual

Aplicación web interactiva desarrollada con **Vue.js 3** para la exploración, filtrado, consulta de fichas técnicas, proyección de tráilers por temporada y gestión de colecciones personales de películas y series.

---

## Descripción General

**Big Cinema** es una cinemateca digital diseñada bajo una dirección de arte editorial inspirada en publicaciones impresas de cine y plataformas de curaduría audiovisual de autor. La interfaz prioriza la jerarquía tipográfica mediante el contraste entre *Instrument Serif* y *Plus Jakarta Sans*, el uso de una paleta oscura de carbón cálido con acentos en oro viejo y bermellón cinematográfico, y la ausencia de ruido visual.

El catálogo integrado consta de **37 obras** seleccionadas —**19 películas** y **18 series**— con pósters locales, sinopsis narrativas redactadas con enfoque editorial, métricas actualizadas de episodios y temporadas, y un módulo de proyección audiovisual que incorpora los tráilers oficiales de cada película y de cada una de las temporadas de las series del archivo.

---

## Características Principales

### 1. Portada Editorial Interactiva
- Vitrina principal con iluminación ambiental dinámica generada a partir del póster de la obra seleccionada.
- Acceso directo para iniciar la reproducción del tráiler oficial, abrir la ficha técnica extendida o guardar la obra en la lista de favoritos.
- Riel inferior de selección rápida con 5 obras destacadas del archivo para alternar la portada en tiempo real.

### 2. Búsqueda Reactiva e Instantánea
- Campo de búsqueda conectado mediante `v-model` con filtrado inmediato por título, género, año de estreno, palabras clave de la sinopsis o estado de favoritos.
- Atajo de teclado global con la tecla `/` para enfocar el buscador desde cualquier punto de la interfaz y `Esc` para limpiar la consulta activa.
- Sugerencias rápidas interactivas cuando no existe una búsqueda en curso.

### 3. Sistema de Filtrado Combinado y Ordenamiento
- **Control segmentado de formato**: alternancia instantánea entre *Todo el archivo*, *Películas* y *Series* con contadores dinámicos.
- **Riel de géneros**: píldoras interactivas para los géneros del catálogo con cálculo reactivo de coincidencias según el formato y la búsqueda activa.
- **Selector de ordenamiento**: organización por relevancia de archivo, mejor calificación, estreno más reciente, más antiguos y orden alfabético.
- **Banda de diagnóstico**: resumen de filtros aplicados con eliminación individual o restablecimiento global en un solo clic.

### 4. Reproductor de Tráilers por Temporada y Ficha Técnica Modal
- **Módulo de proyección audiovisual 16:9**: reproductor integrado de YouTube dentro de la ventana modal de cada título.
- **Selector de temporadas para series**: cada serie dispone de pestañas individuales para todas sus temporadas —por ejemplo, las 5 temporadas de *Breaking Bad*, las 6 de *Better Call Saul*, las 8 de *Game of Thrones*, las 9 de *Dexter*, las 11 de *The Walking Dead* o las 4 de *Kaguya-sama: Love is War*— permitiendo reproducir el tráiler oficial correspondiente a cada entrega.
- **Modo dual de reproducción**: vista previa con carátula de alta definición, reproducción embebida directa y botón de proyección en ventana de cine independiente para garantizar compatibilidad absoluta tanto en servidores web como al abrir el archivo localmente mediante `file://`.
- **Navegación por teclado**: teclas de flecha izquierda y derecha para recorrer el catálogo sin salir de la ventana modal, y cierre rápido con `Esc`.
- **Obras relacionadas**: sugerencias automáticas del mismo género dentro de la ficha técnica.

### 5. Colección Personal de Favoritos con Persistencia Local
- Marcado y desmarcado de obras favoritas desde cualquier tarjeta del catálogo, desde la portada editorial o desde la ficha técnica modal.
- Almacenamiento persistente en el navegador mediante `localStorage` bajo la clave `cinespot_favoritos`.
- Sección dedicada de acceso rápido con contador en la cabecera y opción para vaciar la lista.

---

## Estructura del Proyecto

```text
explorador-peliculas/
├── index.html                      # Documento raíz y maquetación principal de la aplicación
├── README.md                       # Documentación técnica y funcional del proyecto
├── img/                            # Archivo local de 37 pósters en formato vertical
└── src/
    ├── app.js                      # Instancia raíz de Vue 3, estado reactivo y propiedades computadas
    ├── components/
    │   ├── SearchBar.js            # Buscador reactivo con atajos de teclado y sugerencias
    │   ├── FilterToolbar.js        # Barra de herramientas de formato, géneros y ordenamiento
    │   ├── MediaCard.js            # Tarjeta de catálogo con póster, favoritos y velo de sinopsis
    │   └── DetailModal.js          # Ficha técnica modal y reproductor de tráilers por temporada
    ├── data/
    │   └── catalogo.js             # Base de datos local con 37 obras y tráilers por temporada
    └── styles/
        └── main.css                # Sistema de diseño editorial, variables CSS y adaptabilidad móvil
```

---

## Conceptos de Vue.js 3 Implementados

- **Estado reactivo con `ref`**: control de búsqueda, formato activo, género seleccionado, criterio de ordenamiento, obra destacada en portada, ventana modal y conjunto de identificadores favoritos.
- **Propiedades computadas con `computed`**: encadenamiento de filtros de búsqueda, formato, género y ordenamiento en `catalogoFiltrado`, además del cálculo de métricas del catálogo y obras relacionadas.
- **Observadores con `watch`**: sincronización del bloqueo de desplazamiento del documento cuando la ficha técnica modal se encuentra abierta.
- **Ciclo de vida con `onMounted` y `onBeforeUnmount`**: lectura inicial de `localStorage` y registro de oyentes de teclado globales.
- **Comunicación entre componentes**: flujo de datos descendente mediante `props` tipadas y emisión de eventos hacia la raíz mediante `emits` (`toggle-favorito`, `seleccionar-item`, `filtrar-genero`, `update:modelValue`).
- **Directivas declarativas**: uso extensivo de `v-for` con `:key` única, `v-if` / `v-else-if` / `v-else`, `v-model`, `:class` dinámico y modificadores de eventos como `@click.stop` y `@click.self`.

---

## Instrucciones de Ejecución

La aplicación está construida sin dependencias de compilación externas para permitir su ejecución inmediata en cualquier entorno:

1. Clonar o descargar el repositorio en el equipo local.
2. Abrir el archivo `index.html` directamente en cualquier navegador web moderno o servir la carpeta mediante una extensión como **Live Server** en Visual Studio Code.
3. Para reproducir los tráilers embebidos dentro del cuadro modal sin restricciones de origen de YouTube, se recomienda abrir el proyecto con un servidor local HTTP como Live Server o `npx serve .`. Si se ejecuta directamente con doble clic sobre `index.html`, el reproductor incluye además el botón **Proyectar en YouTube** que abre la ventana dedicada de reproducción sin restricciones.
