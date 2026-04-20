<template>
  <div id="bebidas" class="divbebidas">
    <div class="titulin">
      <h2 class="yeah">Bebidas</h2>
    </div>
  </div>

  <div class="contene-platos">
    <div class="container-acomodo">
      <div v-for="b in items" :key="b.idplato" class="container-lateral">
        <div class="tituydesc" :class="{ 'no-disponible': b.noDisponible }">
          <div class="tooltip">
            <img
              :src="b.imagen"
              :alt="b.nombre"
              class="imagen-plato"
              :title="b.tooltipText"
            />
            <span class="tooltip-text">{{ b.tooltipText }}</span>
          </div>

          <h4 class="name">{{ b.nombre }}</h4>

          <p>
            {{ b.descripcion }}
          </p>

          <h4>{{ b.costo_unitario }} bs</h4>
        </div>
      </div>

      <div
        v-if="!items.length"
        class="tituydesc"
        style="opacity: 0.8; grid-column: 1/-1"
      >
        <p>No hay bebidas disponibles por ahora.</p>
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

<style src="./carta_css/productos.css"></style>