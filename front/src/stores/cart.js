import { defineStore } from "pinia";
import { ref, reactive } from "vue";
const KEY = "inkaterra_cart_v1";

export const useCartStore = defineStore("cart", {
  state: () => ({ items: JSON.parse(localStorage.getItem(KEY) || "[]") }),
  getters: {
    totalItems: (s) => s.items.reduce((a, i) => a + i.qty, 0),
    subtotal: (s) => s.items.reduce((a, i) => a + i.precio * i.qty, 0),
  },
  actions: {
    persist() {
      localStorage.setItem(KEY, JSON.stringify(this.items));
    },
    addItem(prod, qty = 1) {
      const i = this.items.findIndex((x) => x.id === prod.id);
      if (i >= 0) this.items[i].qty += qty;
      else
        this.items.push({
          id: prod.id,
          nombre: prod.nombre,
          precio: prod.precio,
          qty,
        });
      this.persist();
    },
    updateQty(id, qty) {
      const it = this.items.find((x) => x.id === id);
      if (!it) return;
      it.qty = Math.max(1, qty | 0);
      this.persist();
    },
    removeItem(id) {
      this.items = this.items.filter((x) => x.id !== id);
      this.persist();
    },
    clear() {
      this.items = [];
      this.persist();
    },
  },
});

export const useDatosPedido = defineStore("datosPedido", () => {
  // CONTACTO
  const contacto = reactive({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
  });

  // PEDIDO (tipo + direccion)
  const tipoPedido = ref("domicilio");

  const direccion = reactive({
    direccion: "",
    zona: "",
    edificio: "",
    descripcionExtra: "",
  });

  const sucursal = ref("");

  // FACTURACIÓN
  const facturacion = reactive({
    tipo: "sin",
    valor: "",
    razonSocial: "",
  });

  // PAGO
  const pago = reactive({
    efectivo: false,
    transferencia: false,
  });

  // Para debug
  function log() {
    console.log("=== DATOS STORE ===");
    console.log("Contacto:", contacto);
    console.log("Pedido tipo:", tipoPedido.value);
    console.log("Dirección:", direccion);
    console.log("Sucursal:", sucursal.value);
    console.log("Facturación:", facturacion);
    console.log("Pago:", pago);
  }

  return {
    contacto,
    tipoPedido,
    direccion,
    sucursal,
    facturacion,
    pago,
    log,
  };
});