import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

// Importaciones directas para las vistas principales
import InicioView from "../views/InicioView.vue";
import CartaView from "../views/CartaView.vue";
import ContactoView from "../views/ContactoView.vue";
import NosotrosView from "../views/NosotrosView.vue";
import PerfilClienteView from "../views/PerfilClienteView.vue";

const routes = [
  { path: "/", name: "inicio", component: InicioView },
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
  { 
    path: '/nosotros', 
    name: 'nosotros',
    component: NosotrosView 
  },
  {
    path: '/perfil',
    name: 'PerfilCliente',
    component: PerfilClienteView
  },
  
  // PANEL DE ADMINISTRADOR
  {
    path: "/admin",
    component: () => import("@/views/admin/AdminLayout.vue"),
    meta: { requiresAuth: true, allowedRoles: ["administrador"] },
    children: [
      { path: "", redirect: "/admin/dashboard" }, 
      {
        path: "dashboard", 
        name: "admin-dashboard",
        component: () => import("@/views/admin/pages/AdminDashboard.vue"),
      },
      {
        path: "usuarios",
        name: "admin-usuarios",
        component: () => import("@/views/admin/pages/AdminUsuarios.vue"),
      },
      {
        path: "clientes",
        name: "admin-clientes",
        component: () => import("../views/admin/pages/AdminClientes.vue"),
      },
      {
        path: "platos",
        name: "admin-platos",
        component: () => import("../views/admin/pages/AdminPlatos.vue"),
      },
      {
        path: "pedidos",
        name: "admin-pedidos",
        component: () => import("../views/admin/pages/AdminPedidos.vue"),
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
        name: "recepcionista-nuevo",
        component: () => import("@/views/recepcionista/paginas/RecepcionistaNuevoPedido.vue"),
      },
      {
        path: "pedidos-pendientes",
        name: "recepcionista-pendientes",
        component: () => import("@/views/recepcionista/paginas/RecepcionistaPedidosPendientes.vue"),
      },
      {
        path: "pedidos-finalizados",
        name: "recepcionista-finalizados",
        component: () => import("@/views/recepcionista/paginas/RecepcionistaListaPedidos.vue"),
      },
      {
        path: "reservas",
        name: "recepcionista-reservas",
        component: () => import("@/views/recepcionista/paginas/RecepcionistaReservasClientes.vue"),
      },
    ],
  },

  // Ruta para el Home (si es diferente a Inicio)
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },

  // Redirigir cualquier ruta desconocida al inicio
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// GUARDIA DE NAVEGACIÓN
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  
  // Verifica si alguna de las rutas en la jerarquía requiere autenticación
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  
  // --- MODO DESARROLLO ---
  // Si quieres desactivar la protección temporalmente, pon esta variable en true
  const modoLibre = false; 

  if (modoLibre) return next();
  // ------------------------

  if (!requiresAuth) return next();

  // Si no está autenticado
  if (!auth.isAuthenticated) {
    console.warn("Bloqueado: No autenticado");
    return next("/"); 
  }

  // Verificar roles
  const allowedRoles = to.matched
    .filter((r) => r.meta.allowedRoles)
    .flatMap((r) => r.meta.allowedRoles);
    
  if (allowedRoles.length && !allowedRoles.includes(auth.rol)) {
    console.warn("Bloqueado: Rol insuficiente");
    return next("/");
  }

  next();
});

export default router;