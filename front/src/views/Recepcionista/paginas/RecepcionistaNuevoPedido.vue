<template>
  <div class="nuevo-pedido-container">
    <header class="pedido-header-simple">
      <h1>Nuevo Pedido</h1>
      <p class="sub">Registrar un pedido directamente desde recepción</p>

      <div class="tabs-top">
        <button
          class="tab"
          :class="{ active: pasoActual === 'pedido' }"
          @click="pasoActual = 'pedido'"
        >
          Pedido
        </button>

        <button
          class="tab"
          :class="{ active: pasoActual === 'datos' }"
          @click="pasoActual = 'datos'"
          :disabled="!carrito.length || cargando"
        >
          Datos del cliente
        </button>
      </div>
    </header>

    <div v-if="pasoActual === 'pedido'" class="pedido-layout">
      <section class="pedido-menu">
        <nav class="menu-tabs">
          <button
            class="menu-tab-btn"
            :class="{ active: seccionActiva === 'entradas' }"
            @click="seccionActiva = 'entradas'"
          >
            Entradas
          </button>
          <button
            class="menu-tab-btn"
            :class="{ active: seccionActiva === 'platos' }"
            @click="seccionActiva = 'platos'"
          >
            Platos
          </button>
          <button
            class="menu-tab-btn"
            :class="{ active: seccionActiva === 'postres' }"
            @click="seccionActiva = 'postres'"
          >
            Postres
          </button>
          <button
            class="menu-tab-btn"
            :class="{ active: seccionActiva === 'bebidas' }"
            @click="seccionActiva = 'bebidas'"
          >
            Bebidas
          </button>
        </nav>

        <EntradasSection
          v-if="seccionActiva === 'entradas'"
          @seleccionar-item="seleccionarDesdeSeccion"
        />
        <PlatosSection
          v-else-if="seccionActiva === 'platos'"
          @seleccionar-item="seleccionarDesdeSeccion"
        />
        <PostresSection
          v-else-if="seccionActiva === 'postres'"
          @seleccionar-item="seleccionarDesdeSeccion"
        />
        <BebidasSection
          v-else-if="seccionActiva === 'bebidas'"
          @seleccionar-item="seleccionarDesdeSeccion"
        />
      </section>

      <aside class="pedido-detalle">
        <h3>Detalle</h3>

        <div class="box">
          <template v-if="itemSeleccionado">
            <div class="item-config">
              <img :src="itemSeleccionado.imagen" class="preview" />

              <div class="info">
                <h4>{{ itemSeleccionado.nombre }}</h4>
                <p>
                  {{ itemSeleccionado.precio }} bs ·
                  {{ itemSeleccionado.categoria }}
                </p>
              </div>
            </div>

            <label>Cantidad</label>
            <input
              type="number"
              v-model.number="itemSeleccionado.cantidad"
              min="1"
            />

            <label>Comentario</label>
            <textarea v-model="itemSeleccionado.comentario" rows="2"></textarea>

            <button class="btn-add" @click="confirmarItem" :disabled="cargando">
              Agregar
            </button>
          </template>

          <p v-else class="empty">
            Selecciona un ítem del menú para configurarlo.
          </p>
        </div>

        <div class="box">
          <h4>Resumen del pedido</h4>

          <p v-if="!carrito.length" class="empty">
            Aún no hay ítems agregados.
          </p>

          <ul v-else class="lista">
            <li v-for="it in carrito" :key="it.id">
              <button class="delete" @click="eliminarDelCarrito(it.id)">
                ✕
              </button>
              <span>{{ it.nombre }} x{{ it.cantidad }}</span>
              <strong>{{ it.subtotal }} bs</strong>
            </li>
          </ul>

          <div v-if="carrito.length" class="total">
            <span>Total</span>
            <strong>{{ totalCarrito }} bs</strong>
          </div>
        </div>
      </aside>
    </div>

    <div v-else>
      <RecepcionistaDatosCliente
        :carrito="carrito"
        @guardar-datos="manejarGuardarDatos"
        @volver="pasoActual = 'pedido'"
        :cargando="cargando"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

import BebidasSection from "@/components/pedidos/SeccionesPedido/SeccionBebidas.vue";
import PlatosSection from "@/components/pedidos/SeccionesPedido/SeccionPlatos.vue";
import EntradasSection from "@/components/pedidos/SeccionesPedido/SeccionEntradas.vue";
import PostresSection from "@/components/pedidos/SeccionesPedido/SeccionPostres.vue";
import RecepcionistaDatosCliente from "@/components/pedidos/SeccionesPedido/DatosEntregaSeccion.vue";

/* Estado local solo para recepcionista */
const pasoActual = ref("pedido"); // 'pedido' | 'datos'
const seccionActiva = ref("entradas");
const itemSeleccionado = ref(null);
const carrito = ref([]);

const ultimoPedidoEnviado = ref(null);
const cargando = ref(false);

const totalCarrito = computed(() =>
  carrito.value.reduce((acc, item) => acc + (item.subtotal || 0), 0),
);

function seleccionarDesdeSeccion(item) {
  itemSeleccionado.value = {
    ...item,
    cantidad: 1,
    comentario: "",
  };
}

function eliminarDelCarrito(id) {
  carrito.value = carrito.value.filter((it) => it.id !== id);
}

/* Fusionar items repetidos por id */
function confirmarItem() {
  if (!itemSeleccionado.value) return;
  const b = itemSeleccionado.value;

  const precioUnitario = b.precio ?? b.costo_unitario ?? b.precioUnitario ?? 0;

  const nuevoItem = {
    id: b.id,
    nombre: b.nombre,
    imagen: b.imagen,
    precio: precioUnitario,
    cantidad: b.cantidad,
    comentario: b.comentario,
    subtotal: b.cantidad * precioUnitario,
    tipo: b.idcategoria || "item",
  };

  const existente = carrito.value.find((it) => it.id === nuevoItem.id);

  if (existente) {
    existente.cantidad += nuevoItem.cantidad;
    existente.subtotal = existente.cantidad * existente.precio;
    carrito.value = [...carrito.value]; // forzar reactividad
  } else {
    carrito.value.push(nuevoItem);
  }
}

async function manejarGuardarDatos(datosClienteYEntrega) {
  if (!carrito.value.length) {
    console.warn("No hay ítems en el carrito");
    return;
  }

  // Evitamos doble clic accidental
  if (cargando.value) {
    console.warn("El pedido ya se está enviando...");
    return;
  }

  cargando.value = true;

  console.log(
    "🧾 datosClienteYEntrega:",
    JSON.stringify(datosClienteYEntrega, null, 2),
  );

  const pedido = datosClienteYEntrega.pedido || {};
  const facturacion = datosClienteYEntrega.facturacion || {};

  let nitFinal = null;
  if (facturacion.tipo === "nit" || facturacion.tipo === "ci") {
    nitFinal = (facturacion.valor || "").trim() || null;
  }

  const razonSocialFinal =
    facturacion.tipo === "sin"
      ? null
      : (facturacion.razonSocial || "").trim() || null;

  const idmesaFinal = pedido.mesa ? Number(pedido.mesa) || null : null;

  // Payload completo con toda la info para que se vea bien en el panel de PENDIENTES
  const payload = {
    cliente: pedido.nombre || pedido.cliente || "Cliente Presencial", 
    modalidad: pedido.modalidad || "Local", 
    direccion: pedido.direccion || null,
    nit: nitFinal,
    razonsocial: razonSocialFinal,
    idmesa: idmesaFinal,
    comentarios: pedido.notas || "",
    platos: carrito.value.map((item) => ({
      idplato: item.id,
      cantidad: item.cantidad,
      detalle: item.comentario || "", // Comentario individual por ítem
    })),
  };

  console.log("Payload a enviar a /api/pedidos:", payload);

  try {
    // Si tu ruta backend es /api/ordenes en vez de pedidos, cámbialo aquí abajo
    const resp = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("Status respuesta:", resp.status);

    if (!resp.ok) {
      const errBody = await resp.json().catch(() => ({}));
      console.error("Error al crear orden:", errBody);
      throw new Error(errBody.message || "Error al crear la orden");
    }

    const ordenCreada = await resp.json();
    console.log("ORDEN CREADA EN BD:", ordenCreada);

    // Reseteamos todo para permitir tomar un nuevo pedido inmediatamente
    ultimoPedidoEnviado.value = null; 
    carrito.value = [];
    itemSeleccionado.value = null;
    pasoActual.value = "pedido";

    alert("Orden registrada correctamente 🎉");
  } catch (err) {
    console.error("Error en manejarGuardarDatos:", err);
    alert("Ocurrió un error al registrar la orden.");
  } finally {
    cargando.value = false;
  }
}
</script>
<style scoped>
/* Contenedor general: respetamos el fondo teal del layout */
.nuevo-pedido-container {
  padding: 0.75rem 0.5rem 1.5rem;
  color: #f9fafb; /* texto claro porque el fondo general es oscuro/teal */
}

/* HEADER */
.pedido-header-simple h1 {
  margin: 0;
  font-size: 1.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #facc15; /* dorado para resaltar sobre el teal */
}

.pedido-header-simple .sub {
  margin: 0.25rem 0 0.75rem;
  font-size: 0.95rem;
  color: #e5e7eb;
  opacity: 0.85;
}

/* Tabs superiores (Pedido / Datos del cliente) */
.tabs-top {
  display: inline-flex;
  margin-top: 0.25rem;
  background: #103338; /* un teal más oscuro que el fondo */
  border-radius: 999px;
  padding: 3px;
  border: 1px solid rgba(250, 204, 21, 0.75);
  margin-bottom: 20px;
}

.tab {
  border: none;
  background: transparent;
  color: #f9fafb;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;
}

.tab.active {
  background: #facc15; /* dorado activo */
  color: #102a2c; /* texto oscuro sobre dorado */
}

.tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* LAYOUT PRINCIPAL: menú + detalle */
.pedido-layout {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(260px, 2fr);
  gap: 1.5rem;
}

/* IZQUIERDA: MENÚ */
.pedido-menu {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Navbar interno Entradas / Platos / Postres / Bebidas */
.menu-tabs {
  display: inline-flex;
  flex-wrap: wrap;
  background: #103338; /* match con tabs-top */
  border-radius: 999px;
  padding: 4px;
  border: 1px solid rgba(250, 204, 21, 0.7);
  margin-bottom: 0.6rem;
  gap: 0.25rem;
}

.menu-tab-btn {
  border: none;
  background: transparent;
  color: #f9fafb;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.8rem;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}

.menu-tab-btn.active {
  background: #facc15;
  color: #102a2c;
}

/* DERECHA: DETALLE DEL PEDIDO */
.pedido-detalle {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pedido-detalle > h3 {
  margin: 0;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #facc15;
}

/* Cajas (detalle y resumen) */
.box {
  margin-top: 0.25rem;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  background: #0f2527; /* caja más oscura que el fondo teal */
  border: 1px solid #061214;
  color: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

/* Ítem seleccionado */
.item-config {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.preview {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid rgba(15, 23, 42, 0.6);
}

.info h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #facc15; /* nombre en dorado */
}

.info p {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  opacity: 0.9;
}

/* Inputs y textarea */
.box label {
  font-size: 0.8rem;
  font-weight: 600;
}

.box input[type="number"],
.box textarea {
  border-radius: 999px;
  border: 1px solid rgba(209, 213, 219, 0.9);
  padding: 0.35rem 0.7rem;
  font-size: 0.85rem;
  color: #111827;
  background: #f7f0e1; /* crema claro, destaca sobre la caja oscura */
}

.box textarea {
  border-radius: 10px;
  resize: vertical;
}

.box input:focus,
.box textarea:focus {
  outline: none;
  border-color: #facc15;
  box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.6);
}

/* Botón agregar */
.btn-add {
  align-self: flex-end;
  margin-top: 0.3rem;
  border: none;
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  background: #14514f; /* verde petróleo */
  color: #fdf7ec;
  transition:
    transform 0.1s ease,
    filter 0.15s ease;
}

.btn-add:hover {
  filter: brightness(1.05);
}

.btn-add:active {
  transform: scale(0.96);
}

/* Estados vacíos */
.empty {
  font-size: 0.85rem;
  opacity: 0.9;
}

/* Lista del resumen */
.lista {
  list-style: none;
  padding: 0;
  margin: 0.3rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.lista li {
  position: relative;
  padding: 0.4rem 0.5rem 0.4rem 2.3rem;
  border-radius: 8px;
  background: rgba(3, 12, 14, 0.95);
  border: 1px solid rgba(31, 41, 55, 0.7);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.lista strong {
  color: #bbf7d0; /* total en verde suave */
}

/* Botón eliminar */
.delete {
  position: absolute;
  left: 0.45rem;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: #b23b3b;
  color: #fff;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.15s ease;
}

.delete:hover {
  background: #e11d48;
}

/* Total */
.total {
  margin-top: 0.45rem;
  border-top: 1px dashed rgba(229, 231, 235, 0.7);
  padding-top: 0.4rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
}

.total strong {
  color: #bbf7d0;
}

/* Responsivo */
@media (max-width: 900px) {
  .pedido-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
