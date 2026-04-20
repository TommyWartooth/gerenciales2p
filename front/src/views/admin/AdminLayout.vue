<template>
  <div class="admin-theme inicio-admin">
    <header class="admin-topbar">
      <h1 class="admin-topbar-title">Panel de administración</h1>
    </header>

    <div class="admin-layout">
      <!-- SIDEBAR IZQUIERDO -->
      <aside class="admin-sidebar">
        <!-- Info del admin arriba -->
        <div class="admin-profile">
          <div class="admin-avatar"></div>
          <div>
            <p class="admin-name">Administrador</p>
            <p class="admin-role">El taitita del Sabor</p>
          </div>
        </div>

        <nav class="admin-menu">
          <RouterLink
            to="/admin/dashboard"
            class="admin-menu-item"
            active-class="admin-menu-item--active"
          >
            <span class="admin-menu-icon">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
                />
              </svg>
            </span>
            <span class="admin-menu-text">Dashboard</span>
          </RouterLink>

          <RouterLink
            to="/admin/usuarios"
            class="admin-menu-item"
            active-class="admin-menu-item--active"
          >
            <span class="admin-menu-icon">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.2 0-9.5 1.6-9.5 4.9V22h19v-2.7c0-3.3-6.2-4.9-9.5-4.9z"
                />
              </svg>
            </span>
            <span class="admin-menu-text">Usuarios</span>
          </RouterLink>

          <RouterLink
            to="/admin/clientes"
            class="admin-menu-item"
            active-class="admin-menu-item--active"
          >
            <span class="admin-menu-icon">𖨆𖨆</span>
            <span class="admin-menu-text">Clientes</span>
          </RouterLink>

          <RouterLink
            to="/admin/platos"
            class="admin-menu-item"
            active-class="admin-menu-item--active"
          >
            <span class="admin-menu-icon">𓌉◯𓇋</span>
            <span class="admin-menu-text">Platos</span>
          </RouterLink>

          <RouterLink
            to="/admin/pedidos"
            class="admin-menu-item"
            active-class="admin-menu-item--active"
          >
            <span class="admin-menu-icon">🗒</span>
            <span class="admin-menu-text">Pedidos</span>
          </RouterLink>
          <!-- 👇 NUEVO: Ver página principal -->
          <button
            type="button"
            class="admin-menu-item"
            @click="irAPaginaPrincipal"
          >
            <span class="admin-menu-icon">🏠︎</span>
            <span class="admin-menu-text">Ver página principal</span>
          </button>
          <button
            type="button"
            class="admin-menu-item admin-menu-item--logout"
            @click="logout"
          >
            <span class="admin-menu-icon">⏻</span>
            <span class="admin-menu-text">Cerrar sesión</span>
          </button>
        </nav>
      </aside>

      <div class="admin-main">
        <div class="admin-wine-strip"></div>

        <div class="admin-main-inner">
          <main class="admin-content">
            <RouterView />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

function logout() {
  router.push('/')
}

function irAPaginaPrincipal() {
  router.push('/')
}
</script>

<style>
@import "../../assets/admin.css";

.inicio-admin {
  min-height: 100vh;
  background: var(--black);
  color: var(--white);
}

.admin-layout {
  display: flex;
  height: calc(100vh - 60px);
}

/* SIDEBAR */
.admin-sidebar {
  width: 240px;
  padding: 30px 20px;
  background: var(--black-soft);
  border-right: 1px solid var(--wine);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.admin-avatar {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  background: var(--wine-dark);
  border: 1px solid var(--gold-dim);
  margin-right: 12px;
}

.admin-name { font-weight: 600; color: var(--white); margin: 0; font-size: 0.9rem; }
.admin-role { font-size: 0.75rem; color: var(--gold-dim); margin: 0; text-transform: uppercase; }

/* MENÚ ITEMS */
.admin-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  justify-content: flex-start; 
  border-radius: 4px;
  border: 1px solid rgba(235, 205, 149, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: var(--muted);
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.3s;
  cursor: pointer;
  margin-bottom: 4px;
}

.admin-menu-item:hover {
  background: var(--wine-dark);
  color: var(--gold);
  border-color: var(--gold-dim);
  transform: translateX(5px);
}

.admin-menu-item--active {
  background: var(--wine-dark) !important;
  color: var(--gold) !important;
  border-color: var(--gold) !important;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
}

/* Específicos */
.admin-menu-item--logout,
.admin-menu-item--home {
  margin-top: 10px;
  font-size: 0.75rem;
  opacity: 0.8;
}

.admin-menu-item--logout:hover {
  background: rgba(120, 20, 20, 0.1);
  color: #ff6b6b;
}

/* Franja decorativa vertical (más fina) */
.admin-wine-strip {
  width: 2px;
  background: linear-gradient(to bottom, var(--wine), var(--black));
}

/* MAIN CONTENT */
.admin-main { flex: 1; display: flex; background: var(--black); }

.admin-main-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--black);
}

.admin-topbar {
  height: 60px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  background: var(--black-soft);
  border-bottom: 1px solid var(--wine);
}

.admin-topbar-title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 1.2rem;
  color: var(--gold);
  margin: 0;
}

.admin-profile {
  display: flex;
  flex-direction: column; /* Avatar arriba, nombre abajo */
  align-items: center;
  text-align: center;
  margin-bottom: 40px;
  gap: 12px;
}

.admin-avatar {
  width: 60px;
  height: 60px;
  margin-right: 0; /* Quitamos el margen lateral */
  border-radius: 50%; /* Circular para más estética */
  border: 2px solid var(--wine);
  box-shadow: 0 0 15px rgba(106, 3, 24, 0.3);
}

.admin-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}
</style>