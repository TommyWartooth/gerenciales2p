<template>
  <div class="inicio-admin">
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
            <p class="admin-role">gerenciales2p</p>
          </div>
        </div>

        <!-- Menú lateral (botones grandes tipo escritorio) -->
        <nav class="admin-menu">
          <RouterLink
            to="/admin/dashboard"
            class="admin-menu-item"
            active-class="admin-menu-item--active"
          >
            <span class="admin-menu-icon">
              <!-- ícono simple tipo panel/estadísticas -->
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
              <!-- ícono simple tipo usuario -->
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
            <span class="admin-menu-icon">👥</span>
            <span class="admin-menu-text">Clientes</span>
          </RouterLink>

          <RouterLink
            to="/admin/platos"
            class="admin-menu-item"
            active-class="admin-menu-item--active"
          >
            <span class="admin-menu-icon">🍽️</span>
            <span class="admin-menu-text">Platos</span>
          </RouterLink>

          <RouterLink
            to="/admin/pedidos"
            class="admin-menu-item"
            active-class="admin-menu-item--active"
          >
            <span class="admin-menu-icon">🧾</span>
            <span class="admin-menu-text">Pedidos</span>
          </RouterLink>
          <!-- 👇 NUEVO: Ver página principal -->
          <button
            type="button"
            class="admin-menu-item"
            @click="irAPaginaPrincipal"
          >
            <span class="admin-menu-icon">🏠</span>
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

      <!-- PARTE DERECHA: TOPBAR + CONTENIDO -->
      <div class="admin-main">
        <!-- Franja verde tipo la imagen -->
        <div class="admin-green-strip"></div>

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
import { useAuthStore } from "@/stores/auth.js";
import { RouterLink, RouterView, useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout(); // limpiamos sesión
  router.push("/"); // redirigimos
}
function irAPaginaPrincipal() {
  // NO cerramos sesión, solo vamos al home público
  router.push("/");
}
</script>

<style scoped>
.inicio-admin {
  min-height: 10vh;
  background: #eae2d3;
  margin-top: -100px;
}

.admin-layout {
  display: flex;
  height: calc(100vh - 60px); /* 60px ≈ alto del header admin */
}

/* SIDEBAR tipo escritorio MuseoGestor */
.admin-sidebar {
  width: 260px;
  box-sizing: border-box;
  padding: 20px 16px;
  background: #f7f1e3; /* panel crema */
  border-right: 3px solid #2f6b5f; /* franja verde oscura */
}

/* Perfil del admin */
.admin-profile {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.admin-avatar {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background: #d8c9aa;
  margin-right: 12px;
}

.admin-name {
  margin: 0;
  font-weight: 700;
  font-size: 0.95rem;
}

.admin-role {
  margin: 0;
  font-size: 0.8rem;
  color: #6d5e4a;
}

/* Menú lateral: botones grandes con sombra suave */
.admin-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d0c0a4;
  background: #fdf8ec;
  box-shadow: 0 2px 0 #c6b69a;
  cursor: pointer;
  text-decoration: none;
  color: #3b2f22;
  font-size: 0.9rem;
  font-weight: 500;
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease,
    color 0.15s ease;
}

/* Ícono dentro del botón */
.admin-menu-icon {
  width: 22px;
  display: flex;
  justify-content: center;
}

/* Texto del botón */
.admin-menu-text {
  flex: 1;
}

/* Hover estilo escritorio */
.admin-menu-item:hover {
  background: #93b99b;
  box-shadow: 0 2px 0 #a6b6a3;
  transform: translateY(-1px);
}

/* Botón activo (ruta actual) */
.admin-menu-item--active {
  background: #2f6b5f;
  color: #fdf8ec;
  border-color: #2f6b5f;
  box-shadow: 0 2px 0 #234f45;
  text-decoration: none;
}

/* Cerrar sesión en rojo suave */
.admin-menu-item--logout {
  margin-top: 24px;
  background: #f9e0de;
  border-color: #d7a4a0;
  box-shadow: 0 2px 0 #c18c88;
  color: #5a2523;
}

.admin-menu-item--logout:hover {
  background: #f4c7c3;
}

/* PARTE DERECHA */
.admin-main {
  flex: 1;
  display: flex;
}
/* Franja verde vertical como en la imagen */
.admin-green-strip {
  width: 30px;
  background: #2f6b5f;
}

/* Contenedor principal del contenido */
.admin-main-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fdf8ec;
  overflow: hidden; /* evita scroll doble */
}

/* TOPBAR */
.admin-topbar {
  height: 30px; /* importante para el calc de arriba */
  padding: 14px 24px;
  border-bottom: 1px solid #d5c7ae;
  background: #f7f1e3;
}
.admin-topbar-title {
  margin: 0;
  font-size: 1.1rem;
  color: #3b2f22;
}

/* AQUÍ ES DONDE QUEREMOS EL SCROLL */
.admin-content {
  flex: 1;
  padding: 18px 24px;
  box-sizing: border-box;
  overflow-y: auto; /* scroll solo en la zona de tablas/datos */
}
</style>
