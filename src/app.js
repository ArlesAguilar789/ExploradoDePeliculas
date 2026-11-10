const { createApp, ref, computed } = Vue;

const app = createApp({
  setup() {
    const catalogo = ref(CATALOGO_CONTENIDO);

    const contenidoDestacado = computed(() => {
      return catalogo.value.find((item) => item.destacado) || catalogo.value[0];
    });

    const totalPeliculas = computed(() => {
      return catalogo.value.filter((item) => item.tipo === "Película").length;
    });

    const totalSeries = computed(() => {
      return catalogo.value.filter((item) => item.tipo === "Serie").length;
    });

    return {
      catalogo,
      contenidoDestacado,
      totalPeliculas,
      totalSeries
    };
  }
});

app.mount("#app");
