const MediaCard = {
  name: "MediaCard",
  props: {
    item: {
      type: Object,
      required: true
    },
    esFavorito: Boolean,
    generoActivo: {
      type: String,
      default: "Todos"
    }
  },
  emits: ["filtrar-genero", "seleccionar-obra", "alternar-favorito"],
  template: `
    <article
      class="media-card is-interactive"
      tabindex="0"
      role="button"
      :aria-label="'Ver ficha técnica de ' + item.titulo"
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
          <span class="poster-rating" v-if="item.calificacion">{{ item.calificacion }}</span>
        </div>
        <div class="poster-hover-meta">
          <div class="hover-primary-row">
            <span class="hover-director">{{ item.director }}</span>
            <span class="hover-duration">{{ item.duracion }}</span>
          </div>
          <span class="hover-cta-line">Consultar ficha técnica</span>
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
          <button
            type="button"
            class="favorito-btn"
            :aria-pressed="esFavorito"
            :aria-label="'Favorito: ' + item.titulo"
            :title="esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'"
            @click.stop="$emit('alternar-favorito', item.id)"
          >
            <span aria-hidden="true">{{ esFavorito ? '★' : '☆' }}</span>
          </button>
        </div>
      </div>
    </article>
  `
};
