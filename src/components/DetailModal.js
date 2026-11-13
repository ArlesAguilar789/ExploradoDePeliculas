const DetailModal = {
  name: "DetailModal",
  props: {
    item: {
      type: Object,
      default: null
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
    "obra-siguiente"
  ],
  methods: {
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
          </div>

          <div class="modal-details-column">
            <div class="modal-top-bar">
              <div class="modal-badges">
                <span class="modal-kicker">Ficha técnica</span>
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

            <div class="modal-specs-grid">
              <div class="modal-spec-cell">
                <span class="spec-label">Formato audiovisual</span>
                <span class="spec-value">{{ item.tipo }}</span>
              </div>

              <div class="modal-spec-cell">
                <span class="spec-label">Género catalogado</span>
                <button
                  type="button"
                  class="modal-genre-link"
                  @click="seleccionarGeneroYCerrar(item.genero)"
                >
                  {{ item.genero }}
                </button>
              </div>

              <div class="modal-spec-cell">
                <span class="spec-label">Año de publicación</span>
                <span class="spec-value">{{ item.anio }}</span>
              </div>

              <div class="modal-spec-cell">
                <span class="spec-label">{{ item.tipo === 'Serie' ? 'Temporadas' : 'Duración total' }}</span>
                <span class="spec-value">{{ item.duracion }}</span>
              </div>

              <div class="modal-spec-cell">
                <span class="spec-label">Dirección creativa</span>
                <span class="spec-value">{{ item.director }}</span>
              </div>

              <div class="modal-spec-cell">
                <span class="spec-label">Clasificación y puntaje</span>
                <span class="spec-value">{{ item.clasificacion }} · {{ item.calificacion }} / 10</span>
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
              <span class="modal-key-hint">Presiona Esc o haz clic fuera del panel para volver al catálogo</span>
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
