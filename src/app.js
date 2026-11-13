const { createApp, ref, computed, onMounted, onUnmounted, watch } = Vue;

function normalizarTexto(texto) {
  if (!texto) return "";
  return texto
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const app = createApp({
  components: {
    MediaCard,
    SearchBar,
    FilterToolbar,
    DetailModal
  },
  setup() {
    const catalogo = ref(CATALOGO_CONTENIDO);
    const terminoBusqueda = ref("");
    const tipoActivo = ref("Todos");
    const generoActivo = ref("Todos");
    const ordenActivo = ref("archivo");
    const idDestacadoActivo = ref(1);
    const obraSeleccionada = ref(null);

    const obrasDestacadas = computed(() => {
      return catalogo.value.filter((item) => item.destacado);
    });

    const contenidoDestacado = computed(() => {
      return (
        catalogo.value.find((item) => item.id === idDestacadoActivo.value) ||
        obrasDestacadas.value[0] ||
        catalogo.value[0]
      );
    });

    const busquedaActiva = computed(() => {
      return normalizarTexto(terminoBusqueda.value).length > 0;
    });

    const hayFiltrosActivos = computed(() => {
      return (
        busquedaActiva.value ||
        tipoActivo.value !== "Todos" ||
        generoActivo.value !== "Todos" ||
        ordenActivo.value !== "archivo"
      );
    });

    const conteoPorTipo = computed(() => {
      const consulta = normalizarTexto(terminoBusqueda.value);
      const base = catalogo.value.filter((item) => {
        const coincideGenero =
          generoActivo.value === "Todos" || item.genero === generoActivo.value;
        if (!coincideGenero) return false;
        if (!consulta) return true;
        return (
          normalizarTexto(item.titulo).includes(consulta) ||
          normalizarTexto(item.director).includes(consulta) ||
          normalizarTexto(item.genero).includes(consulta)
        );
      });

      return {
        todos: base.length,
        peliculas: base.filter((item) => item.tipo === "Película").length,
        series: base.filter((item) => item.tipo === "Serie").length
      };
    });

    const generosDisponibles = computed(() => {
      const consulta = normalizarTexto(terminoBusqueda.value);
      const basePorTipoYBusqueda = catalogo.value.filter((item) => {
        const coincideTipo =
          tipoActivo.value === "Todos" || item.tipo === tipoActivo.value;
        if (!coincideTipo) return false;
        if (!consulta) return true;
        return (
          normalizarTexto(item.titulo).includes(consulta) ||
          normalizarTexto(item.director).includes(consulta) ||
          normalizarTexto(item.genero).includes(consulta)
        );
      });

      const mapaConteo = new Map();
      catalogo.value.forEach((item) => {
        if (!mapaConteo.has(item.genero)) {
          mapaConteo.set(item.genero, 0);
        }
      });

      basePorTipoYBusqueda.forEach((item) => {
        mapaConteo.set(item.genero, (mapaConteo.get(item.genero) || 0) + 1);
      });

      return Array.from(mapaConteo.entries())
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    });

    const catalogoFiltrado = computed(() => {
      const consulta = normalizarTexto(terminoBusqueda.value);

      const filtrados = catalogo.value.filter((item) => {
        const coincideTipo =
          tipoActivo.value === "Todos" || item.tipo === tipoActivo.value;
        if (!coincideTipo) return false;

        const coincideGenero =
          generoActivo.value === "Todos" || item.genero === generoActivo.value;
        if (!coincideGenero) return false;

        if (!consulta) return true;

        const tituloNormalizado = normalizarTexto(item.titulo);
        const directorNormalizado = normalizarTexto(item.director);
        const generoNormalizado = normalizarTexto(item.genero);
        return (
          tituloNormalizado.includes(consulta) ||
          directorNormalizado.includes(consulta) ||
          generoNormalizado.includes(consulta)
        );
      });

      const copiaOrdenada = [...filtrados];
      if (ordenActivo.value === "calificacion") {
        copiaOrdenada.sort(
          (a, b) => parseFloat(b.calificacion) - parseFloat(a.calificacion)
        );
      } else if (ordenActivo.value === "anio-desc") {
        copiaOrdenada.sort((a, b) => b.anio - a.anio);
      } else if (ordenActivo.value === "anio-asc") {
        copiaOrdenada.sort((a, b) => a.anio - b.anio);
      } else if (ordenActivo.value === "titulo-asc") {
        copiaOrdenada.sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
      }

      return copiaOrdenada;
    });

    const tituloSeccionActiva = computed(() => {
      const partes = [];
      if (tipoActivo.value === "Película") {
        partes.push("Películas");
      } else if (tipoActivo.value === "Serie") {
        partes.push("Series");
      } else {
        partes.push("Acervo completo");
      }

      if (generoActivo.value !== "Todos") {
        partes.push("de " + generoActivo.value.toLowerCase());
      }

      if (busquedaActiva.value) {
        partes.push('para "' + terminoBusqueda.value.trim() + '"');
      }

      return partes.join(" ");
    });

    const totalPeliculas = computed(() => {
      return catalogo.value.filter((item) => item.tipo === "Película").length;
    });

    const totalSeries = computed(() => {
      return catalogo.value.filter((item) => item.tipo === "Serie").length;
    });

    const obrasRelacionadas = computed(() => {
      if (!obraSeleccionada.value) return [];
      return catalogo.value
        .filter(
          (item) =>
            item.genero === obraSeleccionada.value.genero &&
            item.id !== obraSeleccionada.value.id
        )
        .slice(0, 4);
    });

    const indiceObraSeleccionada = computed(() => {
      if (!obraSeleccionada.value) return -1;
      return catalogoFiltrado.value.findIndex(
        (item) => item.id === obraSeleccionada.value.id
      );
    });

    const tieneObraAnterior = computed(() => {
      return indiceObraSeleccionada.value > 0;
    });

    const tieneObraSiguiente = computed(() => {
      return (
        indiceObraSeleccionada.value !== -1 &&
        indiceObraSeleccionada.value < catalogoFiltrado.value.length - 1
      );
    });

    function seleccionarDestacado(id) {
      idDestacadoActivo.value = id;
    }

    function cambiarTipo(nuevoTipo) {
      tipoActivo.value = nuevoTipo;
    }

    function cambiarGenero(nuevoGenero) {
      if (generoActivo.value === nuevoGenero && nuevoGenero !== "Todos") {
        generoActivo.value = "Todos";
      } else {
        generoActivo.value = nuevoGenero;
      }
    }

    function cambiarOrden(nuevoOrden) {
      ordenActivo.value = nuevoOrden;
    }

    function limpiarBusqueda() {
      terminoBusqueda.value = "";
    }

    function restablecerFiltros() {
      terminoBusqueda.value = "";
      tipoActivo.value = "Todos";
      generoActivo.value = "Todos";
      ordenActivo.value = "archivo";
    }

    function abrirDetalle(item) {
      obraSeleccionada.value = item;
    }

    function cerrarDetalle() {
      obraSeleccionada.value = null;
    }

    function irObraAnterior() {
      if (tieneObraAnterior.value) {
        obraSeleccionada.value =
          catalogoFiltrado.value[indiceObraSeleccionada.value - 1];
      }
    }

    function irObraSiguiente() {
      if (tieneObraSiguiente.value) {
        obraSeleccionada.value =
          catalogoFiltrado.value[indiceObraSeleccionada.value + 1];
      }
    }

    function manejarTeclado(evento) {
      if (!obraSeleccionada.value) return;
      if (evento.key === "Escape") {
        cerrarDetalle();
      } else if (evento.key === "ArrowLeft") {
        irObraAnterior();
      } else if (evento.key === "ArrowRight") {
        irObraSiguiente();
      }
    }

    watch(obraSeleccionada, (nuevaObra) => {
      document.body.style.overflow = nuevaObra ? "hidden" : "";
    });

    onMounted(() => {
      window.addEventListener("keydown", manejarTeclado);
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", manejarTeclado);
    });

    return {
      catalogo,
      terminoBusqueda,
      tipoActivo,
      generoActivo,
      ordenActivo,
      idDestacadoActivo,
      obraSeleccionada,
      obrasDestacadas,
      contenidoDestacado,
      busquedaActiva,
      hayFiltrosActivos,
      conteoPorTipo,
      generosDisponibles,
      catalogoFiltrado,
      tituloSeccionActiva,
      totalPeliculas,
      totalSeries,
      obrasRelacionadas,
      tieneObraAnterior,
      tieneObraSiguiente,
      seleccionarDestacado,
      cambiarTipo,
      cambiarGenero,
      cambiarOrden,
      limpiarBusqueda,
      restablecerFiltros,
      abrirDetalle,
      cerrarDetalle,
      irObraAnterior,
      irObraSiguiente
    };
  }
});

app.mount("#app");
