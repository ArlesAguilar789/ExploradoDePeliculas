const SearchBar = {
  name: "SearchBar",
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    totalResultados: {
      type: Number,
      required: true
    },
    totalCatalogo: {
      type: Number,
      required: true
    }
  },
  emits: ["update:modelValue", "limpiar"],
  methods: {
    actualizarValor(evento) {
      this.$emit("update:modelValue", evento.target.value);
    },
    limpiarCampo() {
      this.$emit("update:modelValue", "");
      this.$emit("limpiar");
    }
  },
  template: `
    <div class="search-panel">
      <div class="search-field-wrapper" :class="{ 'is-active': modelValue.trim().length > 0 }">
        <svg
          class="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7.5"></circle>
          <line x1="20" y1="20" x2="16.35" y2="16.35"></line>
        </svg>

        <input
          type="search"
          class="search-input"
          :value="modelValue"
          @input="actualizarValor"
          placeholder="Buscar por título o director..."
          aria-label="Buscar películas o series por título o director"
          autocomplete="off"
        >

        <div class="search-actions">
          <span class="search-match-pill" v-if="modelValue.trim().length > 0">
            {{ totalResultados }} de {{ totalCatalogo }}
          </span>
          <button
            v-if="modelValue.trim().length > 0"
            type="button"
            class="search-clear-btn"
            @click="limpiarCampo"
            aria-label="Limpiar búsqueda"
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
            <span>Limpiar</span>
          </button>
        </div>
      </div>
    </div>
  `
};
