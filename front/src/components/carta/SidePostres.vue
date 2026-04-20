<style src="./carta_css/productos.css"></style>

<template>
  <!-- POSTRES ************************************************************* -->
  <div id="postres" class="divpostres">
    <div class="titulin">
      <h2 class="yeah">Postres</h2>
    </div>
  </div>

  <div class="contene-platos">
    <div class="container-acomodo">
      <!-- Recorremos los postres que vienen por props -->
      <div v-for="postre in items" :key="postre.id" class="container-lateral">
        <div
          class="tituydesc"
          :class="{ 'no-disponible': postre.noDisponible }"
        >
          <div class="tooltip">
            <img
              :src="postre.imagen"
              :alt="postre.nombre"
              class="imagen-plato"
              :title="postre.tooltipText"
              draggable="false"
            />
            <span class="tooltip-text">{{ postre.tooltipText }}</span>
          </div>

          <h4 class="name">{{ postre.nombre }}</h4>

          <p>
            {{ postre.descripcion }}
          </p>

          <h4>{{ postre.costo_unitario }} bs</h4>
        </div>
      </div>

      <!-- Si no hay postres -->
      <div
        v-if="!items.length"
        class="container-lateral"
        style="opacity: 0.8; grid-column: 1/-1"
      >
        <div class="tituydesc">
          <p>No hay postres disponibles por ahora.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});
</script>