<style src="./carta_css/productos.css"></style>

<template>
  <!-- ENTRADAS ************************************************************* -->
  <div id="entradas" class="diventradas">
    <div class="titulin">
      <h2 class="yeah">Entradas</h2>
    </div>
  </div>

  <div class="contene-platos">
    <div class="container-acomodo">
      <!-- Recorremos las entradas que vienen por props -->
      <div v-for="entrada in items" :key="entrada.id" class="container-lateral">
        <div
          class="tituydesc"
          :class="{ 'no-disponible': entrada.noDisponible }"
        >
          <div class="tooltip">
            <!-- ✅ tooltip funcional -->
            <img
              :src="entrada.imagen"
              :alt="entrada.nombre"
              class="imagen-plato"
              :title="entrada.tooltipText"
              draggable="false"
            />
            <span class="tooltip-text">{{ entrada.tooltipText }}</span>
          </div>

          <h4 class="name">{{ entrada.nombre }}</h4>

          <p>
            {{ entrada.descripcion }}
          </p>

          <h4>{{ entrada.costo_unitario }} bs</h4>
        </div>
      </div>

      <!-- Si no hay entradas -->
      <div
        v-if="!items.length"
        class="tituydesc"
        style="opacity: 0.8; grid-column: 1/-1"
      >
        <p>No hay entradas disponibles por ahora.</p>
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