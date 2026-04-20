<style src="./carta_css/productos.css"></style>

<template>
  <!-- PLATOS FUERTESSSSS -->
  <div id="pf" class="divpfuertes">
    <div class="titulin">
      <h2 class="yeah">Platos Fuertes</h2>
    </div>
  </div>

  <div class="contene-platos">
    <div class="container-acomodo">
      <!-- Recorremos los platos que vienen por props -->
      <div v-for="plato in items" :key="plato.id" class="container-lateral">
        <div class="tituydesc" :class="{ 'no-disponible': plato.noDisponible }">
          <div class="tooltip">
            <img
              :src="plato.imagen"
              :alt="plato.nombre"
              class="imagen-plato"
              :title="plato.tooltipText"
              draggable="false"
            />
            <span class="tooltip-text">{{ plato.tooltipText }}</span>
          </div>
          <h4 class="name">{{ plato.nombre }}</h4>

          <p>
            {{ plato.descripcion }}
          </p>

          <h4>{{ plato.costo_unitario }} bs</h4>
        </div>
      </div>

      <!-- Si no hay platos -->
      <div
        v-if="!items.length"
        class="container-lateral"
        style="opacity: 0.8; grid-column: 1/-1"
      >
        <div class="tituydesc">
          <p>No hay platos fuertes disponibles por ahora.</p>
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