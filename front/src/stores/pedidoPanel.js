// src/stores/pedidoPanel.js
import { reactive } from "vue";

export const pedidoPanel = reactive({
  abierto: false,

  abrir() {
    this.abierto = true;
  },
  cerrar() {
    this.abierto = false;
  },
  toggle() {
    this.abierto = !this.abierto;
  },
});