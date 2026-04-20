<template>
  <div id="app">
    <header v-if="!esVistaPanel">
      <Navbar />
      <Topbar />
    </header>

    <main>
      <router-view />
    </main>

    <footer v-if="!esVistaPanel">
      <PedidoPanel
        :carrito="carrito"
        @confirmar-bebida="agregarAlCarrito"
        @eliminar-item="eliminarDelCarrito"
        @guardar-datos="manejarGuardarDatos"
      />
      <FooterSeccion />
    </footer>
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

// Computed para detectar si estamos en el panel de control
const esVistaPanel = computed(() => {
  // El ?. evita errores si route.path no ha cargado aún
  return route.path?.startsWith("/admin") || route.path?.startsWith("/recepcionista")
})

const carrito = ref([])

const agregarAlCarrito = (item) => {
  carrito.value.push(item)
}

const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1)
}

const manejarGuardarDatos = (datos) => {
  console.log("Datos guardados:", datos)
}
</script>