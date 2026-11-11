const { createApp, ref, computed } = Vue;

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
    SearchBar
  },
  setup() {
    const catalogo = ref(CATALOGO_CONTENIDO);
    const terminoBusqueda = ref("");

    const contenidoDestacado = computed(() => {
      return catalogo.value.find((item) => item.destacado) || catalogo.value[0];
    });

    const busquedaActiva = computed(() => {
      return normalizarTexto(terminoBusqueda.value).length > 0;
    });

    const catalogoFiltrado = computed(() => {
      const consulta = normalizarTexto(terminoBusqueda.value);
      if (!consulta) {
        return catalogo.value;
      }

      return catalogo.value.filter((item) => {
        const tituloNormalizado = normalizarTexto(item.titulo);
        const directorNormalizado = normalizarTexto(item.director);
        return (
          tituloNormalizado.includes(consulta) ||
          directorNormalizado.includes(consulta)
        );
      });
    });

    const totalPeliculas = computed(() => {
      return catalogo.value.filter((item) => item.tipo === "Película").length;
    });

    const totalSeries = computed(() => {
      return catalogo.value.filter((item) => item.tipo === "Serie").length;
    });

    function limpiarBusqueda() {
      terminoBusqueda.value = "";
    }

    return {
      catalogo,
      terminoBusqueda,
      contenidoDestacado,
      busquedaActiva,
      catalogoFiltrado,
      totalPeliculas,
      totalSeries,
      limpiarBusqueda
    };
  }
});

app.mount("#app");
