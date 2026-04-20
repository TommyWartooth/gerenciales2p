<template>
  <div id="app">
    <template v-if="!esVistaPanel">
      <Navbar />
      <Topbar />
    </template>

    <router-view />

    <template v-if="!esVistaPanel">
      <PedidoPanel
        :carrito="carrito"
        @confirmar-bebida="agregarAlCarrito"
        @eliminar-item="eliminarDelCarrito"
        @guardar-datos="manejarGuardarDatos"
      />
      <FooterSeccion />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/layout/Navbar.vue'
import Topbar from './components/layout/Topbar.vue'
import FooterSeccion from './components/layout/FooterSeccion.vue'
import PedidoPanel from './components/pedidos/PedidoPanel.vue'

const route = useRoute()
const esAdmin = computed(() => route.path.startsWith('/admin'))

const carrito = ref([])

// Oculta navbar/footer cuando estás en admin o recepcionista
const esVistaPanel = computed(
  () =>
    route.path.startsWith("/admin") || route.path.startsWith("/recepcionista"),
);

const carrito = ref([]);
const agregarAlCarrito = (item) => carrito.value.push(item);
const eliminarDelCarrito = (index) => carrito.value.splice(index, 1);
const manejarGuardarDatos = (datos) => console.log("Datos guardados:", datos);
</script>
