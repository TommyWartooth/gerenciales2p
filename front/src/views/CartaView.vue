<template>
  <div class="carta">
    <h1>Nuestra Carta</h1>

    <div class="menu-item" v-for="plato in platos" :key="plato.id">
      <h3>{{ plato.nombre }}</h3>
      <p>{{ plato.descripcion }}</p>
      <span>${{ plato.precio }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const platos = ref([
  {
    id: 1,
    nombre: 'Lomo Saltado',
    descripcion: 'Carne salteada con papas y arroz.',
    precio: 35
  },
  {
    id: 2,
    nombre: 'Ají de Gallina',
    descripcion: 'Pollo en salsa cremosa con arroz.',
    precio: 28
  },
  {
    id: 3,
    nombre: 'Trucha Frita',
    descripcion: 'Trucha acompañada con ensalada.',
    precio: 32
  }
])
</script>

<style scoped>
.carta {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.menu-item {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
}

span {
  font-weight: bold;
}
</style>