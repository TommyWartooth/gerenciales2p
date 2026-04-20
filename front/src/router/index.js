import { createRouter, createWebHistory } from 'vue-router'

import InicioView from '../views/InicioView.vue'
import CartaView from '../views/CartaView.vue'
import ContactoView from '../views/ContactoView.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'

const routes = [
{
path: '/',
component: InicioView
},

{
path: '/carta',
component: CartaView
},

{
path: '/contacto',
component: ContactoView
},

{
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '',         component: () => import('../views/admin/pages/AdminDashboard.vue') },
      { path: 'platos',   component: () => import('../views/admin/pages/AdminPlatos.vue') },
      { path: 'pedidos',  component: () => import('../views/admin/pages/AdminPedidos.vue') },
      { path: 'clientes', component: () => import('../views/admin/pages/AdminClientes.vue') },
      { path: 'usuarios', component: () => import('../views/admin/pages/AdminUsuarios.vue') },
    ]
  }
]
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import InicioView from "../views/InicioView.vue";
import CartaView from "../views/CartaView.vue";
import ContactoView from "../views/ContactoView.vue";

const routes = [
  { path: "/", component: InicioView },
  { path: "/carta", component: CartaView },
  { path: "/contacto", component: ContactoView },
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
  {
    path: "/recepcionista",
    component: () => import("@/views/recepcionista/RecepcionistaLayout.vue"),
    meta: { requiresAuth: true, allowedRoles: ["recepcionista"] },
    children: [
      { path: "", redirect: "/recepcionista/nuevo-pedido" },
      {
        path: "nuevo-pedido",
        component: () =>
          import("@/views/recepcionista/paginas/RecepcionistaNuevoPedido.vue"),
      },
      {
        path: "pedidos-pendientes",
        component: () =>
          import("@/views/recepcionista/paginas/RecepcionistaPedidosPendientes.vue"),
      },
      {
        path: "pedidos-finalizados",
        component: () =>
          import("@/views/recepcionista/paginas/RecepcionistaListaPedidos.vue"),
      },
      {
        path: "reservas",
        component: () =>
          import("@/views/recepcionista/paginas/RecepcionistaReservasClientes.vue"),
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth);
  if (!requiresAuth) return next();
  if (!auth.isAuthenticated) return next("/");
  const allowedRoles = to.matched
    .filter((r) => r.meta.allowedRoles)
    .flatMap((r) => r.meta.allowedRoles);
  if (allowedRoles.length && !allowedRoles.includes(auth.rol)) return next("/");
  next();
});

export default router;
