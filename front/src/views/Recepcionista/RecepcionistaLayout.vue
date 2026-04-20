<template>
  <div class="inicio-recepcionista">
    <!-- TOPBAR SUPERIOR -->
    <header class="recep-topbar">
      <div>
        <h1 class="recep-topbar-title">Panel de recepcionista</h1>
      </div>
      <p class="recep-topbar-title">
        ¡Tu esfuerzo hace que cada plato sea especial!
      </p>
    </header>

    <div class="recep-layout">
      <!-- SIDEBAR IZQUIERDO -->
      <aside class="recep-sidebar">
        <!-- Info del recepcionista -->
        <div class="recep-profile">
          <div class="recep-avatar"></div>
          <div>
            <p class="recep-name">Recepcionista</p>
            <p class="recep-role">gerenciales2p</p>
          </div>
        </div>

        <nav class="recep-menu">
          <RouterLink
            to="/recepcionista/nuevo-pedido"
            class="recep-menu-item"
            active-class="recep-menu-item--active"
          >
            <span class="recep-menu-icon">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 3H5a2 2 0 0 0-2 2v14l4-4h12a2 2 0 0 0 2-2V5a2 
             2 0 0 0-2-2zm-4 9h-2v2h-2v-2H9V10h2V8h2v2h2v2z"
                />
              </svg>
            </span>
            <span class="recep-menu-text">Nuevo pedido</span>
          </RouterLink>

          <RouterLink
            to="/recepcionista/pedidos-pendientes"
            class="recep-menu-item"
            active-class="recep-menu-item--active"
          >
            <span class="recep-menu-icon">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 
             2zm1 11h-4V11h3V6h2z"
                />
              </svg>
            </span>
            <span class="recep-menu-text">Pedidos pendientes</span>
          </RouterLink>

          <!-- ⭐ NUEVO BOTÓN AÑADIDO AQUÍ ⭐ -->
          <RouterLink
            to="/recepcionista/pedidos-finalizados"
            class="recep-menu-item"
            active-class="recep-menu-item--active"
          >
            <span class="recep-menu-icon">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2A10 10 0 1 0 22 12A10.011 10.011 0 0 0 12 
             2zm-1 15l-4-4 1.41-1.41L11 14.17l5.59-5.59L18 
             10z"
                />
              </svg>
            </span>
            <span class="recep-menu-text">Pedidos finalizados</span>
          </RouterLink>
          <!-- ⭐ FIN DEL NUEVO BOTÓN ⭐ -->

          <RouterLink
            to="/recepcionista/reservas"
            class="recep-menu-item"
            active-class="recep-menu-item--active"
          >
            <span class="recep-menu-icon">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 4h-1V2h-2v2H8V2H6v2H5a2.006 2.006 0 0 0-2 
             2v12a2.006 2.006 0 0 0 2 2h14a2.006 2.006 0 0 0 
             2-2V6a2.006 2.006 0 0 0-2-2zm0 14H5V10h14zm0-10H5V6h14z"
                />
              </svg>
            </span>
            <span class="recep-menu-text">Reservas de clientes</span>
          </RouterLink>

          <button
            type="button"
            class="recep-menu-item"
            @click="irAPaginaPrincipal"
          >
            <span class="recep-menu-icon">🏠</span>
            <span class="recep-menu-text">Ver página principal</span>
          </button>
          <button
            type="button"
            class="recep-menu-item recep-menu-item--logout"
            @click="logout"
          >
            <span class="recep-menu-icon">⏻</span>
            <span class="recep-menu-text">Cerrar sesión</span>
          </button>
        </nav>
      </aside>

      <!-- PARTE DERECHA -->
      <div class="recep-main">
        <!-- Franja de color vertical -->
        <div class="recep-color-strip"></div>

        <div class="recep-main-inner">
          <main class="recep-content">
            <RouterView />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();

function irAPaginaPrincipal() {
  // NO borra sesión, solo navega a la zona pública
  router.push("/");
}

function logout() {
  auth.logout(); // borramos datos del usuario
  router.push("/"); // lo mandamos al inicio o al login
}
</script>

<style scoped>
/* CONTENEDOR GENERAL */
.inicio-recepcionista {
  min-height: 100vh;
  /* fondo exterior inspirado en el fondo verde del logo */
  background: linear-gradient(135deg, #0e3a38, #0a2b2a);
  margin-top: -100px;
}

/* LAYOUT PRINCIPAL */
.recep-layout {
  display: flex;
  height: calc(100vh - 60px);
}

/* SIDEBAR: verde petróleo medio, no tan oscuro */
.recep-sidebar {
  width: 260px;
  box-sizing: border-box;
  padding: 20px 16px;
  background: #14514f; /* verde más claro que el fondo */
  border-right: 3px solid #d8b15a; /* dorado borde */
}

/* Perfil recepcionista */
.recep-profile {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.recep-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #f2e4c7; /* cremita del logo */
  margin-right: 12px;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.15);
}

.recep-name {
  margin: 0;
  font-weight: 700;
  font-size: 0.95rem;
  color: #fdf7ec; /* casi blanco cálido */
}

.recep-role {
  margin: 0;
  font-size: 0.8rem;
  color: #f8d99b;
}

/* Menú lateral */
.recep-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recep-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(11, 31, 29, 0.3);
  background: rgba(4, 32, 31, 0.35);
  cursor: pointer;
  text-decoration: none;
  color: #fdf7ec;
  font-size: 0.9rem;
  font-weight: 500;
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease,
    color 0.15s ease,
    border-color 0.15s ease;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.25);
}

.recep-menu-icon {
  width: 22px;
  display: flex;
  justify-content: center;
}

.recep-menu-text {
  flex: 1;
}

/* Hover: aclara y mete un toque dorado */
.recep-menu-item:hover {
  background: #1b5f5c;
  border-color: #f0c96a;
  box-shadow: 0 3px 0 rgba(0, 0, 0, 0.3);
  transform: translateY(-1px);
}

/* Activo: botón dorado con texto verde oscuro (como el borde del logo) */
.recep-menu-item--active {
  background: #f0c96a; /* dorado principal */
  color: #143331; /* verde profundo */
  border-color: #e0b653;
  box-shadow: 0 3px 0 #c79635;
}

/* Cerrar sesión: rojo andino suave */
.recep-menu-item--logout {
  margin-top: 24px;
  background: #7c2525;
  border-color: #9a3232;
  box-shadow: 0 2px 0 #5a1515;
  color: #fce2e2;
}

.recep-menu-item--logout:hover {
  background: #a73434;
}

/* PARTE DERECHA */
.recep-main {
  flex: 1;
  display: flex;
}

/* franja vertical dorada */
.recep-color-strip {
  width: 28px;
  background: #d8b15a;
}

/* Contenedor del contenido: fondo claro tipo pergamino */
.recep-main-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f7f0e1; /* crema claro */
  overflow: hidden;
}

/* TOPBAR */
.recep-topbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  padding: 14px 24px;
  border-bottom: 1px solid #e0cda3;
  background: #173f3d; /* verde intermedio */
}

.recep-topbar-title {
  margin: 0;
  font-size: 1.1rem;
  color: #f0c96a;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Zona donde irá el contenido (con scroll) */
.recep-content {
  flex: 1;
  padding: 18px 24px;
  box-sizing: border-box;
  overflow-y: auto;
  color: #1e2933;
  background-color: #2e4946;
}
</style>
