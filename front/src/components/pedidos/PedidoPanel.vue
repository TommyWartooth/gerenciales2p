<template>
  <!-- Overlay oscuro -->
  <div
    v-if="pedidoPanel.abierto"
    class="pedido-overlay"
    @click.self="pedidoPanel.cerrar()"
  >
    <div class="pedido-panel">
      <!-- HEADER SUPERIOR -->
      <header class="pedido-header">
        <div class="pedido-header-left">
          <span class="pedido-title">Pedidos</span>
        </div>

        <div class="pedido-header-right">
          <div class="pedido-tabs">
            <button
              class="tab-btn"
              :class="{ 'tab-btn--active': pasoActual === 'pedido' }"
              @click="pasoActual = 'pedido'"
            >
              Pedido
            </button>

            <button
              class="tab-btn"
              :class="{ 'tab-btn--active': pasoActual === 'datos' }"
              @click="pasoActual = 'datos'"
              :disabled="!carrito || !carrito.length"
            >
              Datos de entrega
            </button>
          </div>

          <button class="btn-cerrar" @click="pedidoPanel.cerrar()">✕</button>
        </div>
      </header>

      <!-- CONTENIDO PRINCIPAL -->
      <div class="pedido-body">
        <!-- PASO 1: Pedido (lo que ya tenías) -->
        <template v-if="pasoActual === 'pedido'">
          <div class="pedido-layout">
            <!-- COLUMNA IZQUIERDA: MENÚ -->
            <section class="pedido-menu">
              <nav class="menu-tabs">
                <button
                  class="menu-tab-btn"
                  :class="{
                    'menu-tab-btn--active': seccionActiva === 'entradas',
                  }"
                  @click="seccionActiva = 'entradas'"
                >
                  Entradas
                </button>
                <button
                  class="menu-tab-btn"
                  :class="{
                    'menu-tab-btn--active': seccionActiva === 'platos',
                  }"
                  @click="seccionActiva = 'platos'"
                >
                  Platos
                </button>
                <button
                  class="menu-tab-btn"
                  :class="{
                    'menu-tab-btn--active': seccionActiva === 'postres',
                  }"
                  @click="seccionActiva = 'postres'"
                >
                  Postres
                </button>
                <button
                  class="menu-tab-btn"
                  :class="{
                    'menu-tab-btn--active': seccionActiva === 'bebidas',
                  }"
                  @click="seccionActiva = 'bebidas'"
                >
                  Bebidas
                </button>
              </nav>

              <!-- 🔹 Secciones dinámicas -->
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

            <!-- COLUMNA DERECHA: DETALLE DEL PEDIDO -->
            <aside class="pedido-carrito">
              <h3 class="section-title">Tu pedido</h3>

              <p class="section-help">
                Configura el ítem seleccionado y revisa el resumen de tu
                carrito.
              </p>

              <div class="carrito-box">
                <template v-if="itemSeleccionado">
                  <div class="carrito-bebida-header">
                    <div class="carrito-img-wrap">
                      <img
                        :src="itemSeleccionado.imagen"
                        :alt="itemSeleccionado.nombre"
                        class="carrito-img"
                      />
                    </div>
                    <div>
                      <h4 class="carrito-bebida-nombre">
                        {{ itemSeleccionado.nombre }}
                      </h4>
                      <p class="carrito-bebida-precio">
                        {{ itemSeleccionado.precio }} bs
                      </p>
                      <p class="carrito-bebida-precio categoria-chip">
                        {{ itemSeleccionado.categoria }}
                      </p>
                    </div>
                  </div>

                  <div class="carrito-form">
                    <!-- Cantidad -->
                    <div class="campo">
                      <label class="campo-label">Cantidad</label>
                      <input
                        type="number"
                        min="1"
                        v-model.number="itemSeleccionado.cantidad"
                        class="campo-control campo-number"
                      />
                    </div>

                    <!-- Comentario -->
                    <div class="campo">
                      <label class="campo-label">Comentario</label>
                      <textarea
                        rows="2"
                        v-model="itemSeleccionado.comentario"
                        class="campo-control campo-textarea"
                        placeholder="Alguna indicación especial para este ítem..."
                      ></textarea>
                    </div>

                    <!-- Botón -->
                    <button
                      class="btn-confirmar"
                      @click="confirmarItem"
                      :disabled="cerrado"
                    >
                      Agregar al carrito
                    </button>
                  </div>
                </template>

                <template v-else>
                  <p class="mensaje-vacio">
                    Aún no has seleccionado ningún ítem. Haz clic en
                    <strong>Ordenar</strong> en el menú de la izquierda.
                  </p>
                </template>
              </div>

              <!-- 🧾 Caja 2: resumen del carrito completo -->
              <div class="carrito-box carrito-resumen">
                <div class="carrito-resumen-header">
                  <h4 class="carrito-resumen-title">Resumen del carrito</h4>
                  <span
                    v-if="carrito && carrito.length"
                    class="carrito-resumen-count"
                  >
                    {{ carrito.length }} ítem(s)
                  </span>
                </div>

                <p v-if="!carrito || !carrito.length" class="mensaje-vacio">
                  Todavía no has agregado nada al carrito. Confirma un ítem para
                  empezar.
                </p>

                <ul v-else class="carrito-lista">
                  <li
                    v-for="(item, index) in carrito"
                    :key="index"
                    class="carrito-item"
                  >
                    <!-- Botón eliminar en esquina -->
                    <button
                      class="carrito-item-remove-left"
                      @click="emit('eliminar-item', item.id)"
                    >
                      ✕
                    </button>

                    <div class="carrito-item-main">
                      <div>
                        <span class="carrito-item-nombre">
                          {{ item.nombre }}
                        </span>
                        <span class="carrito-item-detalle">
                          x{{ item.cantidad }}
                        </span>
                      </div>
                      <span class="carrito-item-precio">
                        {{ item.subtotal }} bs
                      </span>
                    </div>

                    <p v-if="item.comentario" class="carrito-item-nota">
                      {{ item.comentario }}
                    </p>
                  </li>
                </ul>

                <div v-if="carrito && carrito.length" class="carrito-total">
                  <span>Total</span>
                  <span class="carrito-total-monto">
                    {{ totalCarrito }} bs
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </template>
        <!-- PASO 2: Datos de entrega -->
        <template v-else>
          <DatosEntregaSection
            :carrito="carrito"
            @guardar-datos="manejarGuardarDatos"
            @volver="pasoActual = 'pedido'"
          />
        </template>
        <div v-if="cerrado" class="cerrado-alerta">
          🚫 Estamos cerrados. Pedidos y reservas disponibles de <b>08:00</b> a
          <b>22:00</b>.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, getCurrentInstance, onMounted, onUnmounted } from "vue";
import { pedidoPanel } from "../../stores/pedidoPanel";

import EntradasSection from "../pedidos/SeccionesPedido/SeccionEntradas.vue";
import PlatosSection from "../pedidos/SeccionesPedido/SeccionPlatos.vue";
import PostresSection from "../pedidos/SeccionesPedido/SeccionPostres.vue";
import BebidasSection from "../pedidos/SeccionesPedido/SeccionBebidas.vue";
import DatosEntregaSection from "../pedidos/SeccionesPedido/DatosEntregaSeccion.vue";

const HORA_CIERRE = 22; // 10pm
const HORA_APERTURA = 8; // 8am

function estaCerradoAhora() {
  const ahora = new Date(); // usa hora local del navegador
  const h = ahora.getHours();
  // cerrado si es >= 22 o < 8
  return h >= HORA_CIERRE || h < HORA_APERTURA;
}

const cerrado = ref(estaCerradoAhora());

// opcional: refrescar cada 30s por si cambia la hora mientras está abierto
let t = null;
onMounted(() => {
  t = setInterval(() => (cerrado.value = estaCerradoAhora()), 30000);
});
onUnmounted(() => clearInterval(t));

const props = defineProps({
  carrito: {
    type: Array,
    default: () => [],
  },
});
const pasoActual = ref("pedido");

const emit = defineEmits([
  "confirmar-bebida",
  "eliminar-item",
  "guardar-datos",
]);

const seccionActiva = ref("entradas");

const itemSeleccionado = ref(null);

const totalCarrito = computed(() =>
  (props.carrito || []).reduce((acc, item) => acc + (item.subtotal || 0), 0)
);

function seleccionarDesdeSeccion(item) {
  console.log("[PANEL] seleccionarDesdeSeccion() recibió:", item);
  itemSeleccionado.value = {
    ...item,
    cantidad: 1,
    comentario: "",
  };
}

function confirmarItem() {
  if (!itemSeleccionado.value) return;
  const b = itemSeleccionado.value;

  const precioUnitario = b.precio ?? b.costo_unitario ?? b.precioUnitario ?? 0;

  const itemCarrito = {
    id: b.id,
    nombre: b.nombre,
    imagen: b.imagen,
    precio: precioUnitario,
    cantidad: b.cantidad,
    comentario: b.comentario,
    subtotal: b.cantidad * precioUnitario,
    tipo: b.idcategoria || "item",
  };
  console.log("=== ITEM CARRITO QUE SE EMITE ===");
  console.log("id:", b.id);
  console.log("nombre:", b.nombre);
  console.log("imagen:", b.imagen);
  console.log("precioUnitario:", precioUnitario);
  console.log("cantidad:", b.cantidad);
  console.log("comentario:", b.comentario);
  console.log("categoria/tipo:", b.idcategoria);
  console.log("[PANEL] confirmarItem() emite:", itemCarrito);
  emit("confirmar-bebida", itemCarrito);
}
function manejarGuardarDatos(payload) {
  console.log("****** PAYLOAD RECIBIDO EN PEDIDO PANEL ******");
  console.log(payload);
  console.log("**********************************************\n");

  emit("guardar-datos", payload); // el padre puede limpiar carrito aquí

  pedidoPanel.cerrar();
  pasoActual.value = "pedido";
}

// DEBUG extra para ver si el padre está escuchando algo
onMounted(() => {
  const instance = getCurrentInstance();
  console.log("[PANEL] vnode.props:", instance?.vnode.props);
});
</script>

<style scoped>
.pedido-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 15, 13, 0.88);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Panel principal */
.pedido-panel {
  width: min(1000px, 100% - 2rem);
  max-height: 90vh;
  background: var(--black-soft);
  
  color: #f9fafb;
  overflow-y: auto;
  border-radius: 16px;
  padding: 1.25rem 1.75rem;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.6);
  border:1px solid var(--gold-dim);
}

/* HEADER */
.pedido-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.3);
  padding-bottom: 0.75rem;
  margin-bottom: 1.25rem;
}

.pedido-header-left {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.pedido-title {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #facc15; /* dorado */
}

.pedido-subtitle {
  font-size: 0.9rem;
  opacity: 0.8;
}

.pedido-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Tabs del header */
.pedido-tabs {
  display: inline-flex;
  background:var(--wine-dark);
  border-radius: 999px;
  padding: 3px;
  border:1px solid var(--gold-dim); /* dorado suave */
}

.tab-btn {
  border: none;
  background: transparent;
  color:var(--white);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.tab-btn--active{
  background: linear-gradient(
    135deg,
    #5B1E2D 0%,   /* vino profundo */
    #8C3B3B 30%, /* terracota rojiza */
    #945932 65%, /* cobre andino */
    #87432e 100% /* ocre dorado */
  );

  color: white;
}



/* Botón de cerrar */
.btn-cerrar {
  border:1px solid var(--gold-dim);
  background:var(--wine-dark);
  
  color: #e5e7eb;
  font-size: 1rem;
  line-height: 1;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.1s ease;
}

.btn-cerrar:hover {
  background:var(--wine-light);
}

.btn-cerrar:active {
  transform: scale(0.94);
}

/* CONTENIDO */
.pedido-body {
  font-size: 0.95rem;
}

.pedido-layout {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(260px, 2fr);
  gap: 1.25rem;
}

/* COLUMNA IZQUIERDA: MENÚ */
.pedido-menu {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #fde68a; /* amarillo suave */
}

.section-help {
  font-size: 0.85rem;
  opacity: 0.75;
}

/* COLUMNA DERECHA: DETALLE DEL PEDIDO */
.pedido-carrito {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.carrito-box {
  border-radius: 12px;
  padding: 0.9rem 0.9rem;
  background: rgba(61, 17, 30, 0.7);
  border: 1px solid rgba(15, 23, 42, 0.9);
  min-height: 150px;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

/* Cabecera de la bebida/ítem seleccionado */
.carrito-bebida-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.carrito-img-wrap {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(55, 65, 81, 0.8);
}

.carrito-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carrito-bebida-nombre {
  font-size: 0.95rem;
  font-weight: 600;
  color: #facc15;
}

.carrito-bebida-precio {
  font-size: 0.85rem;
  opacity: 0.85;
}

.categoria-chip {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.8;
}

/* Formulario de config */
.carrito-form {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  font-size: 0.85rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.campo-label {
  font-weight: 600;
  color: #e5e7eb;
}

.campo-control {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  background: rgba(61, 17, 30, 0.7);
  color: #f9fafb;
  padding: 0.35rem 0.7rem;
  font-size: 0.85rem;
}

.campo-control:focus {
  outline: none;
  border-color: #facc15;
  box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.4);
}

.campo-number {
  max-width: 90px;
}

.campo-textarea {
  border-radius: 10px;
  resize: vertical;
}

/* Opciones extra */
.opciones-extra {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.opciones-extra label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  opacity: 0.9;
}

/* Botón confirmar */
.btn-confirmar {
  margin-top: 0.35rem;
  align-self: flex-end;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  background: #166534;
  color: #f9fafb;
  transition: transform 0.1s ease, box-shadow 0.1s ease, filter 0.15s ease;
}

.btn-confirmar:hover {
  filter: brightness(1.05);
}

.btn-confirmar:active {
  transform: scale(0.95);
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.6);
}

.mensaje-vacio {
  font-size: 0.85rem;
  opacity: 0.75;
}

.carrito-resumen {
  gap: 0.5rem;
}

.carrito-resumen-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.carrito-resumen-title {
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #fde68a;
}

.carrito-resumen-count {
  font-size: 0.8rem;
  opacity: 0.8;
}

.carrito-lista {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 0.25rem;
  list-style: none;
  margin-left: -30px;
}

.carrito-item {
  padding: 0.4rem 0.5rem;
  border-radius: 8px;
  background: rgba(61, 17, 30, 0.7);
  border: 1px solid rgba(55, 65, 81, 0.7);
  position: relative;
  padding-left: 3.5rem; /* espacio para la X */
  margin-bottom: 1rem;
}

.carrito-item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.carrito-item-nombre {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #facc15;
}

.carrito-item-detalle {
  display: block;
  font-size: 0.75rem;
  opacity: 0.8;
}

.carrito-item-precio {
  font-size: 0.85rem;
  font-weight: 600;
  color: #bbf7d0;
}

.carrito-item-nota {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  opacity: 0.8;
  font-style: italic;
}

/* Botón eliminar alineado a la izquierda */
.carrito-item-remove-left {
  position: absolute;
  left: 0.3rem;
  top: 50%;
  transform: translateY(-50%);

  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;

  background: #8e4444;
  color: white;
  font-weight: bold;
  font-size: 0.85rem;

  cursor: pointer;
  transition: 0.2s;
}

.carrito-item-remove-left:hover {
  background: #ff1a1a;
}

/* contenido interno */
.carrito-item-content {
  display: flex;
  flex-direction: column;
}
.carrito-total {
  margin-top: 0.5rem;
  border-top: 1px dashed rgba(148, 163, 184, 0.6);
  padding-top: 0.45rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
}

.carrito-total-monto {
  color: #bbf7d0;
}

/* Navbar interno de categorías */
.menu-tabs {
  display: inline-flex;
  flex-wrap: wrap;
  background: rgba(61, 17, 30, 0.7);
  border-radius: 999px;
  padding: 4px;
  border: 1px solid rgba(148, 163, 184, 0.5);
  margin-bottom: 0.4rem;
  gap: 0.25rem;
}

.menu-tab-btn {
  border: none;
  background: transparent;
  color: #e5e7eb;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.menu-tab-btn--active {
  background: linear-gradient(
    135deg,
    #5B1E2D 0%,   /* vino profundo */
    #8C3B3B 30%, /* terracota rojiza */
    #945932 65%, /* cobre andino */
    #87432e 100% /* ocre dorado */
  );

  color: white;
}

/* Responsivo simple */
@media (max-width: 800px) {
  .pedido-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>