import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Importaciones directas para las vistas principales
import InicioView from "../views/InicioView.vue";
import CartaView from "../views/CartaView.vue";
import ContactoView from "../views/ContactoView.vue";
import NosotrosView from "../views/NosotrosView.vue";

const routes = [
  { path: "/", component: () => import("../views/InicioView.vue") },
  { 
    path: "/carta", 
    name: "carta",
    component: CartaView 
  },
  { 
    path: "/contacto", 
    name: "contacto",
    component: ContactoView 
  },
{ path: '/nosotros', component: () => import('../views/NosotrosView.vue') },
  
  // PANEL DE ADMINISTRADOR
  {
    path: "/admin",
    component: () => import("@/views/admin/AdminLayout.vue"),
    meta: { requiresAuth: true, allowedRoles: ["administrador"] },
    children: [
      { path: "", redirect: "/admin/dashboard" },
      {
        path: "dashboard",
        component: () => import("@/views/admin/pages/AdminDashboard.vue"),
      },
      {
        path: "usuarios",
        component: () => import("@/views/admin/pages/AdminUsuarios.vue"),
      },
      {
        path: "clientes",
        component: () => import("@/views/admin/pages/AdminClientes.vue"),
      },
      {
        path: "platos",
        component: () => import("@/views/admin/pages/AdminPlatos.vue"),
      },
      {
        path: "pedidos",
        component: () => import("@/views/admin/pages/AdminPedidos.vue"),
      },
    ],
  },

  // PANEL DE RECEPCIONISTA
  {
    path: "/recepcionista",
    component: () => import("@/views/recepcionista/RecepcionistaLayout.vue"),
    meta: { requiresAuth: true, allowedRoles: ["recepcionista"] },
    children: [
      { path: "", redirect: "/recepcionista/nuevo-pedido" },
      {
        path: "nuevo-pedido",
        component: () => import("@/views/recepcionista/paginas/RecepcionistaNuevoPedido.vue"),
      },
      {
        path: "pedidos-pendientes",
        component: () => import("@/views/recepcionista/paginas/RecepcionistaPedidosPendientes.vue"),
      },
      {
        path: "pedidos-finalizados",
        component: () => import("@/views/recepcionista/paginas/RecepcionistaListaPedidos.vue"),
      },
      {
        path: "reservas",
        component: () => import("@/views/recepcionista/paginas/RecepcionistaReservasClientes.vue"),
      },
    ],
  },

  // Redirigir cualquier ruta desconocida al inicio
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // 1. Obtener el store DENTRO de la función
  const auth = useAuthStore();
  
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  
  // 2. Si la ruta no requiere auth, lo dejamos pasar de inmediato
  if (!requiresAuth) {
    return next();
  }
  
  // 3. Si requiere auth y no está autenticado, al inicio
  if (!auth.isAuthenticated) {
    console.warn("Acceso denegado: Usuario no autenticado");
    return next("/");
  }
  
  // 4. Verificar roles
  const allowedRoles = to.matched
    .filter((r) => r.meta.allowedRoles)
    .flatMap((r) => r.meta.allowedRoles);
    
  if (allowedRoles.length && !allowedRoles.includes(auth.rol)) {
    console.warn("Acceso denegado: Rol insuficiente");
    return next("/");
  }
  
  // 5. Si todo está bien, adelante
  next();
});

export default router;