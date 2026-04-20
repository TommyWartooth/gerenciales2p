import { createRouter, createWebHistory } from "vue-router";

import InicioView from "../views/InicioView.vue";
import CartaView from "../views/CartaView.vue";
import ContactoView from "../views/ContactoView.vue";

const routes = [
  {
    path: "/",
    component: InicioView,
  },

  {
    path: "/carta",
    component: CartaView,
  },

  {
    path: "/contacto",
    component: ContactoView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
