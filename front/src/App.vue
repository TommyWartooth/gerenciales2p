<template>
  <div id="app">
    <Navbar />
    <Topbar />

    <main>
      <Herosection />
      <SideOfrecemos/>
      <Ofertasection />
      <SideSliderPlatos />
      <SideDestacable />
      <SideComentarios />
      <SideMapa/>
      <Footersection />
    </main>
  </div>
</template>

<script setup>
import Topbar from './components/layout/Topbar.vue'
import Navbar from './components/layout/Navbar.vue'
import Footersection from './components/layout/Footersection.vue'
import Herosection from './components/home/Herosection.vue'
import Ofertasection from './components/home/Ofertasection.vue'
import SideSliderPlatos from './components/home/SideSliderPlatos.vue'
import SideComentarios from './components/home/SideComentarios.vue'
import SideMapa from './components/home/SideMapa.vue'
import SideOfrecemos from './components/home/SideOfrecemos.vue'
import SideDestacable from './components/home/SideDestacable.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;700&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  min-height: 100vh;
}

main {
  width: 100%;
}

main > * {
  margin-top: 0;
  margin-bottom: 0;
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
</style>