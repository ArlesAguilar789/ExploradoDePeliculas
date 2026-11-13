const DetailModal = {
  name: "DetailModal",
  props: {
    item: {
      type: Object,
      default: null
    },
    esFavorito: {
      type: Boolean,
      default: false
    },
    iniciarReproduccion: {
      type: Boolean,
      default: false
    },
    obrasRelacionadas: {
      type: Array,
      default: () => []
    },
    tieneAnterior: {
      type: Boolean,
      default: false
    },
    tieneSiguiente: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "cerrar",
    "seleccionar-obra",
    "filtrar-genero",
    "obra-anterior",
    "obra-siguiente",
    "alternar-favorito"
  ],
  data() {
    return {
      indiceTrailerActivo: 0
    };
  },
  computed: {
    listaTrailers() {
      if (!this.item || this.item.director === "Producción Especial") {
        return [];
      }
      if (
        Array.isArray(this.item.temporadasTrailers) &&
        this.item.temporadasTrailers.length > 0
      ) {
        return this.item.temporadasTrailers;
      }
      return [];
    },
    trailerActivo() {
      return (
        this.listaTrailers[this.indiceTrailerActivo] ||
        this.listaTrailers[0] ||
        null
      );
    },
    urlEmbedYoutube() {
      if (!this.trailerActivo) return "";
      const inicio = this.trailerActivo.inicioSegundos || 0;
      const esArchivoLocal =
        typeof window !== "undefined" &&
        window.location &&
        window.location.protocol === "file:";

      if (esArchivoLocal) {
        const config = {
          videoId_s: this.trailerActivo.youtubeId,
          controls_s: 1,
          rel_s: 0,
          loop_s: 0,
          start: inicio,
          playerLang: "es",
          preventFullScreen_s: 1,
          modestbranding_s: 1,
          iv_load_policy: 3,
          showClosedCaptions_s: 0,
          contentScale_s: 1,
          allowWebViewZoom: false
        };
        return (
          "https://lonelycpp.github.io/react-native-youtube-iframe/iframe.html?data=" +
          encodeURIComponent(JSON.stringify(config))
        );
      }

      return (
        "https://www.youtube-nocookie.com/embed/" +
        this.trailerActivo.youtubeId +
        "?rel=0&modestbranding=1" +
        (this.iniciarReproduccion ? "&autoplay=1" : "") +
        (inicio > 0 ? "&start=" + inicio : "")
      );
    },
    urlDirectaYoutube() {
      if (!this.trailerActivo) return "#";
      const inicio = this.trailerActivo.inicioSegundos || 0;
      return (
        "https://www.youtube.com/watch?v=" +
        this.trailerActivo.youtubeId +
        (inicio > 0 ? "&t=" + inicio + "s" : "")
      );
    }
  },
  watch: {
    item: {
      immediate: true,
      handler() {
        this.indiceTrailerActivo = 0;
      }
    }
  },
  methods: {
    seleccionarTemporada(indice) {
      this.indiceTrailerActivo = indice;
    },
    temporadaAnterior() {
      if (this.indiceTrailerActivo > 0) {
        this.indiceTrailerActivo -= 1;
      }
    },
    temporadaSiguiente() {
      if (this.indiceTrailerActivo < this.listaTrailers.length - 1) {
        this.indiceTrailerActivo += 1;
      }
    },
    abrirVentanaYoutube() {
      if (!this.trailerActivo) return;
      window.open(this.urlDirectaYoutube, "_blank", "noopener,noreferrer");
    },
    seleccionarGeneroYCerrar(genero) {
      this.$emit("filtrar-genero", genero);
      this.$emit("cerrar");
    }
  },
  template: `
    <div
      v-if="item"
      class="modal-backdrop"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'modal-title-' + item.id"
      @click.self="$emit('cerrar')"
    >
      <div class="modal-sheet">
        <div
          class="modal-ambient-bg"
          :style="{ backgroundImage: 'url(\\'' + item.imagen + '\\')' }"
        ></div>

        <div class="modal-content-grid">
          <div class="modal-poster-column">
            <div class="modal-poster-frame">
              <img :src="item.imagen" :alt="item.titulo" class="modal-poster-img">
            </div>

            <button
              type="button"
              class="modal-fav-action-btn"
              :class="{ 'is-active': esFavorito }"
              @click="$emit('alternar-favorito', item.id)"
            >
              <svg
                viewBox="0 0 24 24"
                :fill="esFavorito ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span>{{ esFavorito ? 'Guardado en tus favoritos' : 'Guardar en favoritos' }}</span>
            </button>

            <div class="modal-specs-grid">
              <div class="modal-spec-cell">
                <span class="spec-label">Formato</span>
                <span class="spec-value">{{ item.tipo }}</span>
              </div>

              <div class="modal-spec-cell">
                <span class="spec-label">Género</span>
                <button
                  type="button"
                  class="modal-genre-link"
                  @click="seleccionarGeneroYCerrar(item.genero)"
                >
                  {{ item.genero }}
                </button>
              </div>

              <div class="modal-spec-cell">
                <span class="spec-label">Estreno</span>
                <span class="spec-value">{{ item.anio }}</span>
              </div>

              <div class="modal-spec-cell">
                <span class="spec-label">{{ item.tipo === 'Serie' ? 'Temporadas' : 'Duración' }}</span>
                <span class="spec-value">{{ item.duracion }}</span>
              </div>

              <div class="modal-spec-cell modal-spec-cell-wide">
                <span class="spec-label">Dirección creativa</span>
                <span class="spec-value">{{ item.director }}</span>
              </div>

              <div class="modal-spec-cell modal-spec-cell-wide">
                <span class="spec-label">Clasificación y evaluación</span>
                <span class="spec-value">{{ item.clasificacion }} · {{ item.calificacion }} / 10</span>
              </div>
            </div>
          </div>

          <div class="modal-details-column">
            <div class="modal-top-bar">
              <div class="modal-badges">
                <span class="modal-kicker">
                  {{ trailerActivo ? 'Ficha técnica y proyección' : 'Ficha técnica de archivo' }}
                </span>
                <span class="hero-pill">{{ item.tipo }}</span>
                <span class="hero-pill">{{ item.clasificacion }}</span>
                <span class="hero-pill hero-pill-gold">Calificación {{ item.calificacion }}</span>
              </div>

              <button
                type="button"
                class="modal-close-btn"
                @click="$emit('cerrar')"
                aria-label="Cerrar ventana de detalle"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span>Cerrar</span>
              </button>
            </div>

            <div class="modal-Async-header">
              <h2 :id="'modal-title-' + item.id" class="modal-title">{{ item.titulo }}</h2>
              <p class="modal-Quick-meta">
                <span>{{ item.anio }}</span>
                <span class="meta-separator">·</span>
                <span>{{ item.duracion }}</span>
                <span class="meta-separator">·</span>
                <span>Dirección de {{ item.director }}</span>
              </p>
            </div>

            <div class="modal-synopsis-block">
              <h3 class="modal-section-label">Sinopsis argumental</h3>
              <p class="modal-synopsis-text">{{ item.sinopsis }}</p>
            </div>

            <!-- Reproductor de Tráilers por Temporada -->
            <div class="trailer-player-module" v-if="trailerActivo">
              <div class="trailer-module-header">
                <div class="trailer-header-titles">
                  <span class="modal-section-label">
                    {{ item.tipo === 'Serie' ? 'Reproductor de tráilers por temporada' : 'Sala de proyección oficial' }}
                  </span>
                  <h4 class="trailer-active-heading">
                    {{ trailerActivo.etiqueta }} — {{ trailerActivo.subtitulo }}
                  </h4>
                </div>
                <span class="trailer-count-badge" v-if="listaTrailers.length > 1">
                  Temporada {{ indiceTrailerActivo + 1 }} de {{ listaTrailers.length }}
                </span>
              </div>

              <!-- Selector de Temporadas -->
              <div
                class="season-tabs-rail"
                v-if="listaTrailers.length > 1"
                role="tablist"
                aria-label="Seleccionar temporada para reproducir tráiler"
              >
                <button
                  v-for="(temporada, index) in listaTrailers"
                  :key="temporada.numero"
                  type="button"
                  role="tab"
                  class="season-tab-btn"
                  :class="{ 'is-active': index === indiceTrailerActivo }"
                  :aria-selected="index === indiceTrailerActivo"
                  @click="seleccionarTemporada(index)"
                >
                  <span class="season-tab-index">T{{ temporada.numero }}</span>
                  <span>{{ temporada.etiqueta }}</span>
                  <span class="season-tab-year">{{ temporada.anio }}</span>
                </button>
              </div>

              <!-- Pantalla 16:9 -->
              <div class="cinema-viewport">
                <iframe
                  :key="item.id + '-' + indiceTrailerActivo + '-' + trailerActivo.youtubeId"
                  :src="urlEmbedYoutube"
                  :title="'Tráiler de ' + item.titulo + ' - ' + trailerActivo.etiqueta"
                  class="cinema-iframe"
                  frameborder="0"
                  referrerpolicy="strict-origin-when-cross-origin"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>

              <!-- Barra Inferior de Información de Temporada y Controles -->
              <div class="trailer-controls-bar">
                <div class="trailer-season-summary">
                  <div class="trailer-season-meta-row">
                    <span class="trailer-season-pill">{{ trailerActivo.etiqueta }}</span>
                    <span class="trailer-season-ep">{{ trailerActivo.episodios }} · Estreno {{ trailerActivo.anio }}</span>
                  </div>
                  <p class="trailer-season-desc" v-if="trailerActivo.descripcion">
                    {{ trailerActivo.descripcion }}
                  </p>
                </div>

                <div class="trailer-control-actions">
                  <button
                    v-if="listaTrailers.length > 1"
                    type="button"
                    class="trailer-ctrl-btn"
                    :disabled="indiceTrailerActivo === 0"
                    @click="temporadaAnterior"
                  >
                    Temporada anterior
                  </button>

                  <button
                    v-if="listaTrailers.length > 1"
                    type="button"
                    class="trailer-ctrl-btn"
                    :disabled="indiceTrailerActivo >= listaTrailers.length - 1"
                    @click="temporadaSiguiente"
                  >
                    Siguiente temporada
                  </button>

                  <button
                    type="button"
                    class="trailer-ctrl-btn trailer-ctrl-btn-yt"
                    @click="abrirVentanaYoutube"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    <span>Ver en YouTube</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="modal-related-block" v-if="obrasRelacionadas.length > 0">
              <div class="modal-related-header">
                <h3 class="modal-section-label">Más obras de {{ item.genero.toLowerCase() }}</h3>
                <span class="modal-related-hint">Selecciona otra obra para consultar su ficha</span>
              </div>

              <div class="modal-related-grid">
                <button
                  v-for="rel in obrasRelacionadas"
                  :key="rel.id"
                  type="button"
                  class="modal-related-card"
                  @click="$emit('seleccionar-obra', rel)"
                >
                  <img :src="rel.imagen" :alt="rel.titulo" class="modal-related-img">
                  <div class="modal-related-info">
                    <span class="modal-related-title">{{ rel.titulo }}</span>
                    <span class="modal-related-meta">{{ rel.anio }} · {{ rel.duracion }}</span>
                  </div>
                </button>
              </div>
            </div>

            <div class="modal-footer-nav">
              <span class="modal-key-hint">Usa Esc para salir o las flechas del teclado para cambiar de obra</span>
              <div class="modal-nav-buttons">
                <button
                  type="button"
                  class="modal-step-btn"
                  :disabled="!tieneAnterior"
                  @click="$emit('obra-anterior')"
                >
                  Anterior en lista
                </button>
                <button
                  type="button"
                  class="modal-step-btn"
                  :disabled="!tieneSiguiente"
                  @click="$emit('obra-siguiente')"
                >
                  Siguiente en lista
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
};
