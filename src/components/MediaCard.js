const MediaCard = {
  name: "MediaCard",
  props: {
    item: {
      type: Object,
      required: true
    },
    esFavorito: {
      type: Boolean,
      default: false
    },
    generoActivo: {
      type: String,
      default: "Todos"
    }
  },
  emits: ["filtrar-genero", "seleccionar-obra", "alternar-favorito"],
  computed: {
    totalTrailers() {
      return Array.isArray(this.item.temporadasTrailers)
        ? this.item.temporadasTrailers.length
        : 0;
    },
    etiquetaTrailers() {
      if (this.totalTrailers === 0) {
        return "Consultar ficha técnica";
      }
      if (this.item.tipo === "Serie" && this.totalTrailers > 1) {
        return this.totalTrailers + " tráilers por temporada";
      }
      return "Ver tráiler y ficha";
    }
  },
  template: `
    <article
      class="media-card is-interactive"
      tabindex="0"
      role="button"
      :aria-label="'Ver ficha técnica y tráilers de ' + item.titulo"
      @click="$emit('seleccionar-obra', item)"
      @keydown.enter.self.prevent="$emit('seleccionar-obra', item)"
      @keydown.space.self.prevent="$emit('seleccionar-obra', item)"
    >
      <div class="poster-frame">
        <img
          :src="item.imagen"
          :alt="item.titulo"
          class="poster-image"
          loading="lazy"
        >
        <div class="poster-top-bar">
          <span class="poster-badge">{{ item.tipo }}</span>
          <div class="poster-top-right">
            <span class="poster-rating" v-if="item.calificacion">{{ item.calificacion }}</span>
            <button
              type="button"
              class="poster-fav-btn"
              :class="{ 'is-saved': esFavorito }"
              :aria-pressed="esFavorito"
              :aria-label="esFavorito ? 'Quitar ' + item.titulo + ' de favoritos' : 'Guardar ' + item.titulo + ' en favoritos'"
              :title="esFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'"
              @click.stop="$emit('alternar-favorito', item.id)"
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
            </button>
          </div>
        </div>

        <div class="poster-hover-meta">
          <div class="hover-primary-row">
            <span class="hover-director">{{ item.director }}</span>
            <span class="hover-duration">{{ item.duracion }}</span>
          </div>
          <div class="hover-cta-line">
            <svg
              v-if="totalTrailers > 0"
              class="hover-play-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <polygon points="6 4 20 12 6 20 6 4"></polygon>
            </svg>
            <span>{{ etiquetaTrailers }}</span>
          </div>
        </div>
      </div>

      <div class="card-body">
        <h3 class="card-title" :title="item.titulo">{{ item.titulo }}</h3>
        <div class="card-meta">
          <button
            type="button"
            class="card-genre-btn"
            :class="{ 'is-highlighted': generoActivo === item.genero }"
            @click.stop="$emit('filtrar-genero', item.genero)"
            :title="'Filtrar por ' + item.genero"
          >
            {{ item.genero }}
          </button>
          <span class="card-year">{{ item.anio }}</span>
        </div>
      </div>
    </article>
  `
};
