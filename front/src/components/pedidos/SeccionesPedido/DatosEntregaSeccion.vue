<template>
  <section class="datos-layout">
    <!-- COLUMNA IZQUIERDA: DATOS DEL CLIENTE / ENTREGA -->
    <div class="datos-col-izq">
      <!-- CONTACTO -->
      <div class="datos-card">
        <header class="datos-card-header">
          <div class="datos-card-titulo">
            <span class="datos-card-label">Contacto</span>
          </div>
          <button class="icon-btn" @click="toggleEdicion('contacto')">✎</button>
        </header>

        <div class="datos-card-body">
          <!-- Resumen cuando está colapsado -->
          <template v-if="seccionActiva !== 'contacto'">
            <p
              v-if="contacto.nombre || contacto.apellido"
              class="datos-resumen"
            >
              {{ contacto.nombre }} {{ contacto.apellido }}
            </p>
            <p v-if="contacto.correo" class="datos-resumen">
              {{ contacto.correo }}
            </p>
            <p v-if="contacto.telefono" class="datos-resumen">
              {{ contacto.telefono }}
            </p>
            <p
              v-if="
                !contacto.nombre &&
                !contacto.apellido &&
                !contacto.correo &&
                !contacto.telefono
              "
              class="datos-resumen datos-resumen--vacio"
            >
              Sin datos de contacto. Haz clic en el lápiz para completar.
            </p>
          </template>

          <!-- Form cuando está en edición -->
          <form
            v-else
            class="datos-form-grid"
            @submit.prevent="guardarSeccion('contacto')"
          >
            <div class="campo">
              <label class="campo-label"
                >Nombre <span class="requerido">*</span></label
              >
              <input
                v-model="contacto.nombre"
                type="text"
                class="campo-control"
                placeholder="Nombre"
                required
              />
            </div>
            <div class="campo">
              <label class="campo-label"
                >Apellido <span class="requerido">*</span></label
              >
              <input
                v-model="contacto.apellido"
                type="text"
                class="campo-control"
                placeholder="Apellido"
                required
              />
            </div>
            <div class="campo">
              <label class="campo-label">Correo electrónico</label>
              <input
                v-model="contacto.correo"
                type="email"
                class="campo-control"
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div class="campo">
              <label class="campo-label"
                >Número de teléfono <span class="requerido">*</span></label
              >
              <input
                v-model="contacto.telefono"
                type="tel"
                class="campo-control"
                placeholder="+591 ..."
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
      <!-- DETALLES DE FACTURACIÓN -->
      <div class="datos-card">
        <header class="datos-card-header">
          <div class="datos-card-titulo">
            <span class="datos-card-label">Detalles de facturación</span>
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
                    ? "Sin detalles de facturación"
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
              {{ facturacion.valor }}
            </p>

            <p
              v-if="facturacion.tipo !== 'sin' && !facturacion.valor"
              class="datos-resumen datos-resumen--vacio"
            >
              Sin valor registrado. Haz clic en el lápiz para completar.
            </p>
          </template>

          <!-- Form -->
          <form
            v-else
            class="datos-form-col"
            @submit.prevent="guardarSeccion('facturacion')"
          >
            <div class="campo">
              <label class="campo-label">Tipo de detalle</label>
              <select v-model="facturacion.tipo" class="campo-control">
                <option value="sin">Sin detalles de facturación</option>
                <option value="nit">NIT</option>
                <option value="ci">CI</option>
              </select>
            </div>

            <!-- Solo pedir texto si NO es "sin" -->
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
                    ? 'Ingresa el NIT para la factura'
                    : 'Ingresa el CI para la factura'
                "
              />
              <label class="campo-label"
                >Razon Social <span class="requerido">*</span></label
              >
              <input
                v-model="facturacion.razonSocial"
                type="text"
                class="campo-control"
                placeholder="A quien va la factura"
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

      <!-- TIPO DE PEDIDO / DIRECCIÓN -->
      <div class="datos-card">
        <header class="datos-card-header">
          <div class="datos-card-titulo">
            <span class="datos-card-label">Tipo de pedido</span>
          </div>
          <button class="icon-btn" @click="toggleEdicion('pedido')">✎</button>
        </header>

        <div class="datos-card-body">
          <!-- Resumen -->
          <template v-if="seccionActiva !== 'pedido'">
            <p class="datos-resumen">
              <strong>
                {{
                  tipoPedido === "domicilio"
                    ? "Entrega a domicilio"
                    : "Recoger en restaurante"
                }}
              </strong>
            </p>

            <p
              v-if="tipoPedido === 'domicilio' && direccion.direccion"
              class="datos-resumen"
            >
              {{ direccion.direccion }}
            </p>
            <p
              v-if="tipoPedido === 'recoger' && sucursal"
              class="datos-resumen"
            >
              Sucursal: {{ sucursal }}
            </p>

            <p
              v-if="
                tipoPedido === 'domicilio' &&
                !direccion.direccion &&
                !direccion.zona &&
                !direccion.edificio &&
                !direccion.descripcionExtra
              "
              class="datos-resumen datos-resumen--vacio"
            >
              Sin dirección registrada. Haz clic en el lápiz para completar.
            </p>
          </template>

          <!-- Form -->
          <form
            v-else
            class="datos-form-col"
            @submit.prevent="guardarSeccion('pedido')"
          >
            <!-- opciones de tipo de pedido -->
            <div class="grupo-opciones">
              <label class="radio-row">
                <input type="radio" value="domicilio" v-model="tipoPedido" />
                <span>Entrega a domicilio</span>
              </label>
              <label class="radio-row">
                <input type="radio" value="recoger" v-model="tipoPedido" />
                <span>Recoger en restaurante</span>
              </label>
            </div>

            <!-- Si es domicilio, mostrar dirección -->
            <div v-if="tipoPedido === 'domicilio'" class="subcard">
              <div class="campo">
                <label class="campo-label">
                  Dirección <span class="requerido">*</span>
                </label>
                <input
                  v-model="direccion.direccion"
                  type="text"
                  class="campo-control"
                  placeholder="Ej: Calle 123, edificio X"
                  required
                />
              </div>
              <div class="campo">
                <label class="campo-label">Zona / Barrio</label>
                <input
                  v-model="direccion.zona"
                  type="text"
                  class="campo-control"
                  placeholder="Zona / barrio"
                />
              </div>
              <div class="campo">
                <label class="campo-label">Nro. edificio - piso</label>
                <input
                  v-model="direccion.edificio"
                  type="text"
                  class="campo-control"
                  placeholder="Ej: Torre A, piso 3, dpto 301"
                />
              </div>
              <div class="campo">
                <label class="campo-label">Descripción extra</label>
                <textarea
                  v-model="direccion.descripcionExtra"
                  rows="2"
                  class="campo-control campo-textarea"
                  placeholder="Referencias, puntos de referencia, etc."
                ></textarea>
              </div>
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
            <span class="datos-card-label">Tipo de pago</span>
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
              <span>Pago en efectivo</span>
            </label>
            <label class="check-row">
              <input type="checkbox" v-model="pago.transferencia" />
              <span>Transferencia (con el repartidor)</span>
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
          {{ procesando ? "Procesando..." : "Confirmar datos y continuar" }}
        </button>
      </div>
    </div>

    <!-- COLUMNA DERECHA: RESUMEN DEL CARRITO -->
    <aside class="datos-col-der">
      <div class="resumen-card">
        <h3 class="section-title">Resumen del pedido</h3>

        <p v-if="!carrito || !carrito.length" class="mensaje-vacio">
          Tu pedido está vacío.
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
import { computed, ref, onMounted } from "vue";
import { useDatosPedido } from "../../../stores/cart";
import { useAuthStore } from "../../../stores/auth";

const procesando = ref(false);

const props = defineProps({
  carrito: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["guardar-datos", "volver"]);

const seccionActiva = ref(null);

const datosPedido = useDatosPedido();
const auth = useAuthStore(); // 💡 acá está el usuario logueado

const contacto = datosPedido.contacto;
const direccion = datosPedido.direccion;
const sucursal = datosPedido.sucursal;
const facturacion = datosPedido.facturacion;
const pago = datosPedido.pago;

const tipoPedido = computed({
  get() {
    return datosPedido.tipoPedido;
  },
  set(valor) {
    datosPedido.tipoPedido = valor;
  },
});

const metodosPagoSeleccionados = computed(() => {
  const arr = [];
  if (pago.efectivo) arr.push("Efectivo");
  if (pago.transferencia) arr.push("Transferencia");
  return arr;
});

const totalCarrito = computed(() =>
  (props.carrito || []).reduce((acc, item) => acc + (item.subtotal || 0), 0)
);

onMounted(() => {
  const u = auth.usuario;
  if (!u) return;

  // CONTACTO
  if (!contacto.nombre && u.nombre) contacto.nombre = u.nombre;
  if (!contacto.apellido && u.apellidos) contacto.apellido = u.apellidos;
  if (!contacto.correo && u.correo) contacto.correo = u.correo;

  if (!contacto.telefono && (u.celular || u.telefono_fijo)) {
    contacto.telefono = u.celular || u.telefono_fijo;
  }

  if ((!facturacion.tipo || facturacion.tipo === "sin") && u.nit) {
    facturacion.tipo = "nit";
    facturacion.valor = u.nit;
    facturacion.razonSocial = u.razon_social || "";
  }
});
function construirComentarioPedido(carrito) {
  return (carrito || [])
    .filter((i) => i.comentario && i.comentario.trim())
    .map((i) => `• ${i.nombre} (x${i.cantidad}): ${i.comentario.trim()}`)
    .join("\n");
}

function toggleEdicion(seccion) {
  seccionActiva.value = seccionActiva.value === seccion ? null : seccion;
}

function cancelarEdicion() {
  seccionActiva.value = null;
}

function guardarSeccion(seccion) {
  // logs si quieres...
  seccionActiva.value = null;
}

async function confirmarDatos() {
  if (procesando.value) return;

  if (!props.carrito || !props.carrito.length) {
    alert("Tu carrito está vacío.");
    return;
  }

  if (!auth.usuario) {
    alert("Debes iniciar sesión para confirmar el pedido.");
    return;
  }

  procesando.value = true;

  try {
    const payload = {
      contacto: { ...contacto },
      pedido: {
        tipo: tipoPedido.value,
        direccion: { ...direccion },
      },
      pago: { ...pago },
      facturacion: { ...facturacion },
    };

    const idmodalidad = tipoPedido.value === "domicilio" ? 1 : 2;

    // ✅ FIX: direccion nunca puede ser NULL por tu BD
    const direccionFinal =
      tipoPedido.value === "domicilio"
        ? (direccion?.direccion || "").trim()
        : "RECOGER EN SUCURSAL";

    if (tipoPedido.value === "domicilio" && !direccionFinal) {
      alert("Para pedido a domicilio debes ingresar una dirección.");
      return;
    }
    const comentarioPedido = construirComentarioPedido(props.carrito);

    const bodyPedido = {
      comentarios: comentarioPedido || null,

      idmodalidad,
      idestadop: 1,
      direccion: direccionFinal, // ✅ aquí estaba el error
      documento: auth.usuario.documento,
      platos: (props.carrito || []).map((item) => ({
        idplato: item.id,
        cantidad: item.cantidad,
      })),
    };

    console.log("=== BODY QUE SE ENVÍA A /api/pedidos ===");
    console.log(bodyPedido);

    const resp = await fetch("http://localhost:3000/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPedido),
    });

    // ⚠️ Si backend devuelve HTML en error, esto puede romper,
    // pero si ya no da 500, te sirve normal:
    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data.message || data.error || "Error al crear el pedido");
    }

    console.log("✅ Pedido creado en backend:", data);
    alert("¡Pedido creado correctamente! 🎉");

    emit("guardar-datos", {
      ...payload,
      pedidoCreado: data,
    });
  } catch (err) {
    console.error(err);
    alert(err.message || "Error al procesar el pedido");
  } finally {
    procesando.value = false;
  }
}
</script>

<style scoped>
.datos-layout {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(260px, 2fr);
  gap: 1.5rem;
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
  background: rgba(15, 23, 42, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(30, 64, 175, 0.5);
  padding: 0.85rem 1rem;
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
  color: #fde68a;
}

.icon-btn {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  background: rgba(15, 23, 42, 0.9);
  color: #e5e7eb;
  width: 30px;
  height: 30px;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.1s ease;
}

.icon-btn:hover {
  background: rgba(55, 65, 81, 0.9);
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
  opacity: 0.6;
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
  background: rgba(15, 23, 42, 0.9);
  color: #f9fafb;
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
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
.grupo-opciones {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 0.4rem;
}

.radio-row,
.check-row {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  opacity: 0.9;
}

.radio-row input,
.check-row input {
  accent-color: #eab308;
}

.subcard {
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(51, 65, 85, 0.7);
  padding: 0.6rem 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
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
}

.btn-primario {
  background: #facc15;
  color: #0b1720;
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
  color: #fde68a;
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
  background: rgba(15, 23, 42, 0.85);
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
  opacity: 0.8;
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