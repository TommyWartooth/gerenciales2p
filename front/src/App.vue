<template>
  <div id="app">
    <Navbar />
    <Topbar />
    <router-view />
    <PedidoPanel
      :carrito="carrito"
      @confirmar-bebida="agregarAlCarrito"
      @eliminar-item="eliminarDelCarrito"
      @guardar-datos="manejarGuardarDatos"
    />
    <FooterSeccion />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from './components/layout/Navbar.vue'
import Topbar from './components/layout/Topbar.vue'
import FooterSeccion from './components/layout/FooterSeccion.vue'
import PedidoPanel from './components/pedidos/PedidoPanel.vue'

const carrito = ref([])

const agregarAlCarrito = (item) => {
  carrito.value.push(item)
}

const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1)
}

const manejarGuardarDatos = (datos) => {
  console.log('Datos guardados:', datos)
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;700&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --wine:       #44020e;
  --wine-dark:  #2e0109;
  --wine-light: #6a0318;
  --gold:       #ebcd95;
  --gold-dim:   #c9a96e;
  --black:      #110f0d;
  --black-soft: #1c1917;
  --white:      #faf6f0;
  --muted:      #9e8e7e;
}

html { scroll-behavior: smooth; }

body {
  font-family: 'Jost', sans-serif;
  background-color: var(--black);
  color: var(--white);
  overflow-x: hidden;
}

h1, h2, h3, h4 {
  font-family: 'Cormorant Garamond', serif;
}

#app { width: 100%; min-height: 100vh; }
main { width: 100%; }
main > * { margin-top: 0; margin-bottom: 0; }
</style>