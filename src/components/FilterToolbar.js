const FilterToolbar = {
  name: "FilterToolbar",
  props: {
    tipoActivo: {
      type: String,
      default: "Todos"
    },
    generoActivo: {
      type: String,
      default: "Todos"
    },
    ordenActivo: {
      type: String,
      default: "archivo"
    },
    generosDisponibles: {
      type: Array,
      required: true
    },
    conteoPorTipo: {
      type: Object,
      required: true
    },
    hayFiltrosActivos: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "cambiar-tipo",
    "cambiar-genero",
    "cambiar-orden",
    "restablecer-filtros"
  ],
  template: `
    <div class="filter-toolbar" role="region" aria-label="Filtros de catálogo">
      <div class="filter-primary-row">
        <div class="type-segmented-control" role="tablist" aria-label="Filtrar por formato">
          <button
            type="button"
            role="tab"
            class="type-tab-btn"
            :class="{ 'is-active': tipoActivo === 'Todos' }"
            :aria-selected="tipoActivo === 'Todos'"
            @click="$emit('cambiar-tipo', 'Todos')"
          >
            <span>Todas</span>
            <span class="type-tab-count">{{ conteoPorTipo.todos }}</span>
          </button>

          <button
            type="button"
            role="tab"
            class="type-tab-btn"
            :class="{ 'is-active': tipoActivo === 'Película' }"
            :aria-selected="tipoActivo === 'Película'"
            @click="$emit('cambiar-tipo', 'Película')"
          >
            <span>Películas</span>
            <span class="type-tab-count">{{ conteoPorTipo.peliculas }}</span>
          </button>

          <button
            type="button"
            role="tab"
            class="type-tab-btn"
            :class="{ 'is-active': tipoActivo === 'Serie' }"
            :aria-selected="tipoActivo === 'Serie'"
            @click="$emit('cambiar-tipo', 'Serie')"
          >
            <span>Series</span>
            <span class="type-tab-count">{{ conteoPorTipo.series }}</span>
          </button>
        </div>

        <div class="filter-controls-right">
          <div class="sort-control">
            <label for="catalog-sort-select" class="sort-label">Ordenar por</label>
            <div class="sort-select-wrapper">
              <select
                id="catalog-sort-select"
                class="sort-select"
                :value="ordenActivo"
                @change="$emit('cambiar-orden', $event.target.value)"
              >
                <option value="archivo">Orden de archivo</option>
                <option value="calificacion">Mayor calificación</option>
                <option value="anio-desc">Más recientes</option>
                <option value="anio-asc">Más antiguos</option>
                <option value="titulo-asc">Título A - Z</option>
              </select>
              <svg
                class="sort-chevron"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          <button
            v-if="hayFiltrosActivos"
            type="button"
            class="clear-filters-btn"
            @click="$emit('restablecer-filtros')"
          >
            Restablecer criterios
          </button>
        </div>
      </div>

      <div class="genre-rail-wrapper">
        <span class="genre-rail-label">Géneros</span>
        <div class="genre-pills-list" role="list">
          <button
            type="button"
            class="genre-pill-btn"
            :class="{ 'is-active': generoActivo === 'Todos' }"
            @click="$emit('cambiar-genero', 'Todos')"
          >
            <span>Todos los géneros</span>
          </button>

          <button
            v-for="genero in generosDisponibles"
            :key="genero.nombre"
            type="button"
            class="genre-pill-btn"
            :class="{ 'is-active': generoActivo === genero.nombre }"
            @click="$emit('cambiar-genero', genero.nombre)"
          >
            <span>{{ genero.nombre }}</span>
            <span class="genre-pill-count">{{ genero.cantidad }}</span>
          </button>
        </div>
      </div>
    </div>
  `
};
