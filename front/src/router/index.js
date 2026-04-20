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

const router = createRouter({
history: createWebHistory(),
routes
})

export default router