<template>
  <section class="datos-layout">
    <!-- COLUMNA IZQUIERDA: DATOS DEL CLIENTE / PEDIDO / PAGO -->
    <div class="datos-col-izq">
      <!-- CONTACTO (solo nombre y apellido) -->
      <div class="datos-card">
        <header class="datos-card-header">
          <div class="datos-card-titulo">
            <span class="datos-card-label">Datos del cliente</span>
          </div>
          <button class="icon-btn" @click="toggleEdicion('contacto')">✎</button>
        </header>

        <div class="datos-card-body">
          <!-- Resumen -->
          <template v-if="seccionActiva !== 'contacto'">
            <p
              v-if="contacto.nombre || contacto.apellido"
              class="datos-resumen"
            >
              {{ contacto.nombre }} {{ contacto.apellido }}
            </p>
            <p v-else class="datos-resumen datos-resumen--vacio">
              Sin datos del cliente. Haz clic en el lápiz para completar.
            </p>
          </template>

          <!-- Form -->
          <form
            v-else
            class="datos-form-grid"
            @submit.prevent="guardarSeccion('contacto')"
          >
            <div class="campo">
              <label class="campo-label">
                Nombre <span class="requerido">*</span>
              </label>
              <input
                v-model="contacto.nombre"
                type="text"
                class="campo-control"
                placeholder="Nombre"
                required
              />
            </div>
            <div class="campo">
              <label class="campo-label">
                Apellido <span class="requerido">*</span>
              </label>
              <input
                v-model="contacto.apellido"
                type="text"
                class="campo-control"
                placeholder="Apellido"
                required
              />
            </div>

            <div class="acciones-form">
              <button
                type="button"
                class="btn-secundario"
                @click="cancelarEdicion"
              >
                Cancelar
              </button>
              <button type="submit" class="btn-primario">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- DETALLES DE FACTURACIÓN (igual idea, pero simple) -->
      <div class="datos-card">
        <header class="datos-card-header">
          <div class="datos-card-titulo">
            <span class="datos-card-label">Facturación</span>
          </div>
          <button class="icon-btn" @click="toggleEdicion('facturacion')">
            ✎
          </button>
        </header>

        <div class="datos-card-body">
          <!-- Resumen -->
          <template v-if="seccionActiva !== 'facturacion'">
            <p class="datos-resumen">
              <strong>
                {{
                  facturacion.tipo === "sin"
                    ? "Sin factura"
                    : facturacion.tipo === "nit"
                    ? "NIT"
                    : "CI"
                }}
              </strong>
            </p>

            <p
              v-if="facturacion.tipo !== 'sin' && facturacion.valor"
              class="datos-resumen"
            >
              {{ facturacion.valor }} —
              {{ facturacion.razonSocial || "Sin razón social" }}
            </p>

            <p
              v-if="facturacion.tipo !== 'sin' && !facturacion.valor"
              class="datos-resumen datos-resumen--vacio"
            >
              Falta completar datos de factura. Haz clic en el lápiz.
            </p>
          </template>

          <!-- Form -->
          <form
            v-else
            class="datos-form-col"
            @submit.prevent="guardarSeccion('facturacion')"
          >
            <div class="campo">
              <label class="campo-label">Tipo de factura</label>
              <select v-model="facturacion.tipo" class="campo-control">
                <option value="sin">Sin factura</option>
                <option value="nit">NIT</option>
                <option value="ci">CI</option>
              </select>
            </div>

            <div
              class="campo"
              v-if="facturacion.tipo === 'nit' || facturacion.tipo === 'ci'"
            >
              <label class="campo-label">
                {{ facturacion.tipo === "nit" ? "NIT" : "CI" }}
              </label>
              <input
                v-model="facturacion.valor"
                type="text"
                class="campo-control"
                :placeholder="
                  facturacion.tipo === 'nit'
                    ? 'Ingresa el NIT'
                    : 'Ingresa el CI'
                "
              />

              <label class="campo-label">
                Razón Social <span class="requerido">*</span>
              </label>
              <input
                v-model="facturacion.razonSocial"
                type="text"
                class="campo-control"
                placeholder="A nombre de quién va la factura"
                required
              />
            </div>

            <div class="acciones-form">
              <button
                type="button"
                class="btn-secundario"
                @click="cancelarEdicion"
              >
                Cancelar
              </button>
              <button type="submit" class="btn-primario">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- DETALLES DEL PEDIDO INTERNO (sin domicilio/recoger) -->
      <div class="datos-card">
        <header class="datos-card-header">
          <div class="datos-card-titulo">
            <span class="datos-card-label">Detalles del pedido</span>
          </div>
          <button class="icon-btn" @click="toggleEdicion('pedido')">✎</button>
        </header>

        <div class="datos-card-body">
          <!-- Resumen -->
          <template v-if="seccionActiva !== 'pedido'">
            <p class="datos-resumen">
              <strong v-if="pedido.mesa">
                Mesa / zona: {{ pedido.mesa }}
              </strong>
              <span v-else class="datos-resumen datos-resumen--vacio">
                Sin mesa/zona registrada.
              </span>
            </p>
            <p v-if="pedido.notas" class="datos-resumen">
              {{ pedido.notas }}
            </p>
          </template>

          <!-- Form -->
          <form
            v-else
            class="datos-form-col"
            @submit.prevent="guardarSeccion('pedido')"
          >
            <div class="campo">
              <label class="campo-label">
                Mesa / zona <span class="requerido">*</span>
              </label>
              <input
                v-model="pedido.mesa"
                type="text"
                class="campo-control"
                placeholder="Ej: Mesa 4, Terraza, Barra..."
                required
              />
            </div>

            <div class="campo">
              <label class="campo-label">Notas internas</label>
              <textarea
                v-model="pedido.notas"
                rows="2"
                class="campo-control campo-textarea"
                placeholder="Alguna indicación para cocina o salón..."
              ></textarea>
            </div>

            <div class="acciones-form">
              <button
                type="button"
                class="btn-secundario"
                @click="cancelarEdicion"
              >
                Cancelar
              </button>
              <button type="submit" class="btn-primario">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- TIPO DE PAGO -->
      <div class="datos-card">
        <header class="datos-card-header">
          <div class="datos-card-titulo">
            <span class="datos-card-label">Pago</span>
          </div>
          <button class="icon-btn" @click="toggleEdicion('pago')">✎</button>
        </header>

        <div class="datos-card-body">
          <!-- Resumen -->
          <template v-if="seccionActiva !== 'pago'">
            <p v-if="metodosPagoSeleccionados.length" class="datos-resumen">
              {{ metodosPagoSeleccionados.join(" / ") }}
            </p>
            <p v-else class="datos-resumen datos-resumen--vacio">
              Sin método de pago seleccionado.
            </p>
          </template>

          <!-- Form -->
          <form
            v-else
            class="datos-form-col"
            @submit.prevent="guardarSeccion('pago')"
          >
            <label class="check-row">
              <input type="checkbox" v-model="pago.efectivo" />
              <span>Efectivo</span>
            </label>
            <label class="check-row">
              <input type="checkbox" v-model="pago.transferencia" />
              <span>Transferencia / QR</span>
            </label>

            <div class="acciones-form">
              <button
                type="button"
                class="btn-secundario"
                @click="cancelarEdicion"
              >
                Cancelar
              </button>
              <button type="submit" class="btn-primario">Guardar</button>
            </div>
          </form>
        </div>
      </div>

      <!-- BOTÓN FINAL -->
      <div class="datos-footer">
        <button
          class="btn-confirmar"
          @click="confirmarDatos"
          :disabled="procesando"
        >
          {{
            procesando ? "Procesando..." : "Confirmar datos y registrar pedido"
          }}
        </button>
      </div>
    </div>

    <!-- COLUMNA DERECHA: RESUMEN DEL CARRITO -->
    <aside class="datos-col-der">
      <div class="resumen-card">
        <h3 class="section-title">Resumen del pedido</h3>

        <p v-if="!carrito || !carrito.length" class="mensaje-vacio">
          El pedido está vacío.
        </p>

        <ul v-else class="carrito-lista">
          <li
            v-for="(item, index) in carrito"
            :key="index"
            class="carrito-item"
          >
            <div class="carrito-item-main">
              <div>
                <span class="carrito-item-nombre">{{ item.nombre }}</span>
                <span class="carrito-item-detalle">x{{ item.cantidad }}</span>
              </div>
              <span class="carrito-item-precio"> {{ item.subtotal }} bs </span>
            </div>
          </li>
        </ul>

        <div v-if="carrito && carrito.length" class="carrito-total">
          <span>Total</span>
          <span class="carrito-total-monto">{{ totalCarrito }} bs</span>
        </div>
      </div>
    </aside>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

const props = defineProps({
  carrito: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["guardar-datos", "volver"]);

const procesando = ref(false);
const seccionActiva = ref(null);

const contacto = reactive({
  nombre: "",
  apellido: "",
});

const facturacion = reactive({
  tipo: "sin", // sin | nit | ci
  valor: "",
  razonSocial: "",
});

const pedido = reactive({
  mesa: "",
  notas: "",
});

const pago = reactive({
  efectivo: true,
  transferencia: false,
});

const metodosPagoSeleccionados = computed(() => {
  const arr = [];
  if (pago.efectivo) arr.push("Efectivo");
  if (pago.transferencia) arr.push("Transferencia / QR");
  return arr;
});

const totalCarrito = computed(() =>
  (props.carrito || []).reduce((acc, item) => acc + (item.subtotal || 0), 0)
);

function toggleEdicion(seccion) {
  seccionActiva.value = seccionActiva.value === seccion ? null : seccion;
}

function cancelarEdicion() {
  seccionActiva.value = null;
}

function guardarSeccion(seccion) {
  // aquí solo cerramos la sección; la data ya está en los reactives
  seccionActiva.value = null;
}

function confirmarDatos() {
  if (procesando.value) return;
  procesando.value = true;

  const payload = {
    contacto: { ...contacto },
    pedido: {
      tipo: "local", // fijo: es pedido interno del restaurante
      mesa: pedido.mesa,
      notas: pedido.notas,
    },
    pago: { ...pago },
    facturacion: { ...facturacion },
  };

  emit("guardar-datos", payload);

  setTimeout(() => {
    procesando.value = false;
  }, 400);
}
</script>

<style scoped>
.datos-layout {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(260px, 2fr);
  gap: 1.5rem;
  align-items: flex-start;
  color: #f9fafb;
}

/* columnas */
.datos-col-izq {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.datos-col-der {
  display: flex;
  flex-direction: column;
}

/* cards */
.datos-card,
.resumen-card {
  background: #0f2527;
  border-radius: 12px;
  border: 1px solid rgba(6, 18, 20, 0.9);
  padding: 0.85rem 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
}

/* header de card */
.datos-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.datos-card-label {
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #facc15;
}

.icon-btn {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: #071517;
  color: #e5e7eb;
  width: 30px;
  height: 30px;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s;
}

.icon-btn:hover {
  background: #10292c;
  box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.35);
}

.icon-btn:active {
  transform: scale(0.94);
}

.datos-card-body {
  font-size: 0.85rem;
}

/* resumen texto */
.datos-resumen {
  margin: 0.1rem 0;
  opacity: 0.9;
}

.datos-resumen--vacio {
  opacity: 0.65;
  font-style: italic;
}

/* forms */
.datos-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem 0.75rem;
  margin-top: 0.3rem;
}

.datos-form-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.3rem;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.campo-label {
  font-weight: 600;
  color: #e5e7eb;
}

.campo-control {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  background: #071517;
  color: #f9fafb;
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
}

.campo-control::placeholder {
  color: rgba(148, 163, 184, 0.8);
}

.campo-control:focus {
  outline: none;
  border-color: #facc15;
  box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.4);
}

.campo-textarea {
  border-radius: 10px;
  resize: vertical;
}

.requerido {
  color: #f97373;
}

/* opciones */
.check-row {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  opacity: 0.9;
}

.check-row input {
  accent-color: #facc15;
}

/* buttons */
.acciones-form {
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
  margin-top: 0.3rem;
}

.btn-primario,
.btn-secundario,
.btn-confirmar {
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: filter 0.15s ease, transform 0.1s ease, box-shadow 0.15s;
}

.btn-primario {
  background: #facc15;
  color: #10292c;
}

.btn-secundario {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.7);
  color: #e5e7eb;
}

.btn-confirmar {
  width: 100%;
  margin-top: 0.4rem;
  background: #166534;
  color: #f9fafb;
}

.btn-primario:hover,
.btn-confirmar:hover {
  filter: brightness(1.05);
  box-shadow: 0 0 0 1px rgba(250, 204, 21, 0.3);
}

.btn-secundario:hover {
  filter: brightness(1.05);
}

.btn-primario:active,
.btn-secundario:active,
.btn-confirmar:active {
  transform: scale(0.97);
}

/* footer */
.datos-footer {
  margin-top: 0.4rem;
}

/* resumen carrito (col der) */
.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #facc15;
  margin-bottom: 0.4rem;
}

.mensaje-vacio {
  font-size: 0.85rem;
  opacity: 0.8;
}

.carrito-lista {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  list-style: none;
  margin: 0.3rem 0 0;
  padding: 0;
}

.carrito-item {
  padding: 0.35rem 0.4rem;
  border-radius: 8px;
  background: #071517;
  border: 1px solid rgba(55, 65, 81, 0.7);
}

.carrito-item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.carrito-item-nombre {
  font-size: 0.8rem;
  font-weight: 600;
  color: #facc15;
}

.carrito-item-detalle {
  display: block;
  font-size: 0.75rem;
  opacity: 0.85;
}

.carrito-item-precio {
  font-size: 0.8rem;
  font-weight: 600;
  color: #bbf7d0;
}

.carrito-total {
  margin-top: 0.5rem;
  border-top: 1px dashed rgba(148, 163, 184, 0.6);
  padding-top: 0.4rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 600;
}

.carrito-total-monto {
  color: #bbf7d0;
}

/* responsive */
@media (max-width: 800px) {
  .datos-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
