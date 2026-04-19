<template>
  <nav class="navbar">
    <div class="navbar__inner">

      <!-- Logo -->
      <router-link to="/" class="navbar__logo" @click="closeMenu">
        <img src="/icono.png" alt="Logo" class="navbar__logo-img" />
      </router-link>

      <!-- Links -->
      <ul class="navbar__links" :class="{ 'navbar__links--open': menuOpen }">
        <li>
          <router-link to="/" @click="closeMenu">Inicio</router-link>
        </li>
        <li>
          <router-link to="/carta" @click="closeMenu">Carta</router-link>
        </li>
        <li>
          <router-link to="/nosotros" @click="closeMenu">Sobre Nosotros</router-link>
        </li>
        <li>
          <router-link to="/contacto" @click="closeMenu">Contacto</router-link>
        </li>
      </ul>

      <!-- Auth -->
      <div class="navbar__auth">
        <router-link to="/login" class="navbar__auth-link">Log In</router-link>
        <router-link to="/register" class="navbar__auth-link">Sign Up</router-link>

        <button 
          class="navbar__cta"
          @click="abrirPedido"
        >
          Pedir Ahora
        </button>
      </div>

      <!-- Burger -->
      <button 
        class="navbar__burger" 
        @click="pedidoPanel.abrir" 
        :class="{ open: menuOpen }" 
        aria-label="Menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

    </div>
  </nav>

  
</template>

<script setup>
import { ref, inject } from 'vue'
import { pedidoPanel } from '../../stores/pedidoPanel'


const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

const abrirPedido = () => {
  pedidoPanel.abrir();
};
</script>

<style scoped>
.navbar {
  background-color: var(--black);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(235, 205, 149, 0.15);
}

.navbar__inner {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 4rem;
  height: 80px;
  gap: 3rem;
}

.navbar__logo { display: flex; align-items: center; }

.navbar__logo-img {
  height: 56px;
  width: auto;
  object-fit: contain;
}

.navbar__links {
  display: flex;
  list-style: none;
  gap: 5rem;
  flex: 1;
  justify-content: center;
}

.navbar__links a {
  color: var(--white);
  text-decoration: none;
  font-family: 'Jost', sans-serif;
  font-weight: 500;
  font-size: 0.88rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: color 0.2s;
  position: relative;
  padding-bottom: 3px;
}

.navbar__links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--gold);
  transition: width 0.3s;
}

.navbar__links a:hover { color: var(--gold); }
.navbar__links a:hover::after { width: 100%; }

.navbar__auth {
  display: flex;
  align-items: center;
  gap: 1.8rem;
  white-space: nowrap;
}

.navbar__auth-link {
  color: var(--muted);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}

.navbar__auth-link:hover { color: var(--gold); }

.navbar__cta {
  background-color: var(--wine);
  color: var(--gold);
  padding: 0.55rem 1.6rem;
  border-radius: 3px;
  text-decoration: none;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid var(--gold-dim);
  transition: all 0.2s;
}

.navbar__cta:hover {
  background-color: var(--wine-light);
  color: var(--white);
  border-color: var(--gold);
}

.navbar__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
}

.navbar__burger span {
  display: block;
  width: 24px;
  height: 1.5px;
  background: var(--gold);
  transition: all 0.3s;
}

.navbar__burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.navbar__burger.open span:nth-child(2) { opacity: 0; }
.navbar__burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

@media (max-width: 900px) {
  .navbar__inner { padding: 0 1.5rem; }
  .navbar__burger { display: flex; }
  .navbar__auth { display: none; }

  .navbar__links {
    display: none;
    position: absolute;
    top: 80px;
    left: 0; right: 0;
    background: var(--black-soft);
    flex-direction: column;
    align-items: center;
    padding: 2rem 0;
    gap: 1.6rem;
    border-bottom: 1px solid rgba(235,205,149,0.12);
  }

  .navbar__links--open { display: flex; }
}
</style>