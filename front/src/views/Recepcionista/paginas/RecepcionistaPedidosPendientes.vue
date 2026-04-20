<template>
  <section class="pendientes-container">
    <!-- HEADER SUPERIOR -->
    <header class="pendientes-header">
      <div>
        <h1 class="pendientes-title">Pedidos pendientes</h1>
        <p class="pendientes-sub">
          Revisa, actualiza el estado y gestiona los pedidos en curso
        </p>
      </div>
      <span class="badge-pedidos"> {{ pedidos.length }} pedidos </span>
    </header>

    <!-- CUERPO PRINCIPAL: lista izquierda + detalle derecha -->
    <div class="pendientes-layout">
      <!-- IZQUIERDA: lista de pedidos -->
      <section class="pendientes-lista">
        <div v-for="pedido in pedidos" :key="pedido.id" class="pendiente-card">
          <div class="pendiente-header">
            <h3>Pedido #{{ pedido.id }}</h3>
            <div class="pendiente-resumen">
              <span>Total: {{ pedido.total }} Bs.</span>
              <span>Estado: {{ pedido.estado }}</span>
            </div>
          </div>

          <div class="pendiente-items">
            <div
              v-for="item in pedido.items"
              :key="item.nombre"
              class="pendiente-item"
            >
              <div>
                <strong>{{ item.nombre }}</strong>
                <div class="item-detalle">
                  x{{ item.cantidad }} • {{ item.detalle }}
                </div>
              </div>
              <span>{{ item.precio }} Bs.</span>
            </div>
          </div>

          <div class="pendiente-botones">
            <button class="btn-detalles" @click="verDetalles(pedido)">
              + Mostrar más detalles
            </button>

            <select
              v-model.number="pedido.estadoPropuestoId"
              class="select-estado"
            >
              <option v-for="op in opcionesEstado" :key="op.id" :value="op.id">
                {{ op.label }}
              </option>
            </select>

            <!-- Botón que realmente aplica el cambio -->
            <button class="btn-hecho" @click="confirmarEstado(pedido)">
              Confirmar estado
            </button>
          </div>
        </div>
      </section>

      <aside class="pendientes-detalle">
        <template v-if="pedidoSeleccionado">
          <h3 class="detalle-title">Pedido #{{ pedidoSeleccionado.id }}</h3>

          <!-- Items -->
          <div class="detalle-items">
            <div
              v-for="item in pedidoSeleccionado.items"
              :key="item.nombre"
              class="detalle-item"
            >
              <div>
                <strong>{{ item.nombre }}</strong>
                <div class="item-detalle">
                  x{{ item.cantidad }} • {{ item.detalle }}
                </div>
              </div>
              <span>{{ item.precio }} Bs.</span>
            </div>
          </div>

          <!-- ESTADO (solo texto) -->
          <div class="campo">
            <label>Estado:</label>
            <span class="campo-span">
              {{ pedidoSeleccionado.estado }}
            </span>
          </div>

          <div class="campo">
            <label>Total:</label>
            <span class="campo-span">{{ pedidoSeleccionado.total }} Bs.</span>
          </div>

          <div class="campo">
            <label>Modalidad:</label>
            <span class="campo-span">{{ pedidoSeleccionado.modalidad }}</span>
          </div>

          <div class="campo">
            <label>Nombre cliente:</label>
            <span class="campo-span">{{ pedidoSeleccionado.cliente }}</span>
          </div>

          <div class="campo">
            <label>Dirección:</label>
            <span class="campo-span">
              {{ pedidoSeleccionado.direccion || "Sin dirección." }}
            </span>
          </div>

          <div class="campo">
            <label>Comentarios:</label>
            <span class="campo-span campo-span--multiline">
              {{ pedidoSeleccionado.comentarios || "Sin comentarios." }}
            </span>
          </div>

          <h4 class="subtitulo">Detalles de facturación</h4>
          <div class="campo">
            <label>NIT:</label>
            <span class="campo-span">{{ pedidoSeleccionado.nit }}</span>
          </div>
          <div class="campo">
            <label>Razón social:</label>
            <span class="campo-span">{{ pedidoSeleccionado.razonSocial }}</span>
          </div>
        </template>

        <template v-else>
          <p class="mensaje-vacio">
            Elige <strong>"Mostrar más detalles"</strong> en un pedido de la
            lista para ver su información aquí.
          </p>
        </template>
      </aside>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted } from "vue";

// Estados según la BD
const opcionesEstado = [
  { id: 1, label: "Pendiente" },
  { id: 2, label: "Confirmado" },
  { id: 3, label: "En preparación" },
  { id: 4, label: "Hecho" },
  { id: 5, label: "Cancelado" },
];

function labelEstado(id) {
  const op = opcionesEstado.find((o) => o.id === id);
  return op ? op.label : "Desconocido";
}

const pedidos = ref([]);
const pedidoSeleccionado = ref(null);
const cargando = ref(false);

async function cargarPedidos() {
  cargando.value = true;

  try {
    const res = await fetch("/api/pedidos");
    if (!res.ok) throw new Error("Error cargando pedidos");

    const data = await res.json();

    // Agregar estadoPropuestoId para el select
    pedidos.value = data.map((p) => ({
      ...p,
      estadoPropuestoId: p.idestadop,
    }));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    cargando.value = false;
  }
}

function verDetalles(pedido) {
  pedidoSeleccionado.value = pedido;
}
async function confirmarEstado(pedido) {
  const nuevoEstado = pedido.estadoPropuestoId;

  try {
    const res = await fetch(`/api/pedidos/${pedido.id}/estado`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idestadop: nuevoEstado }),
    });

    let body = null;
    try {
      body = await res.json();
    } catch (_) {}

    console.log("PATCH estado →", res.status, body);

    if (!res.ok) {
      const msg =
        (body && body.message) ||
        `Error ${res.status} al actualizar el estado del pedido`;
      alert(msg);
      return;
    }

    pedido.idestadop = body.idestadop;
    pedido.estado = body.estado || labelEstado(body.idestadop);

    if (nuevoEstado === 4 || nuevoEstado === 5) {
      pedidos.value = pedidos.value.filter((p) => p.id !== pedido.id);

      if (pedidoSeleccionado.value?.id === pedido.id) {
        pedidoSeleccionado.value = null;
      }
      return;
    }

    if (nuevoEstado === 3) {
      const correo = {
        correo: pedido.correoCliente,
        asunto: "Tu pedido está en preparación",
        mensaje: `Hola ${pedido.cliente}, tu pedido #${pedido.id} se está preparando.`,
      };
      console.log("Correo generado:", correo);
    }

    console.log("Estado actualizado OK:", pedido);
  } catch (err) {
    console.error("Error PATCH estado:", err);
    alert("No se pudo actualizar el estado del pedido");
  }
}

onMounted(() => cargarPedidos());
</script>

<style scoped>
.pendientes-container {
  padding: 0.75rem 0.5rem 1.5rem;
  color: #f9fafb;
}

/* HEADER */
.pendientes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.pendientes-title {
  margin: 0;
  font-size: 1.4rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #facc15;
}

.pendientes-sub {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  opacity: 0.85;
}

.badge-pedidos {
  border-radius: 999px;
  padding: 0.25rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 600;
  background: #0f2527;
  border: 1px solid rgba(250, 204, 21, 0.7);
}

/* layout izquierda/derecha */
.pendientes-layout {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(280px, 2fr);
  gap: 1rem;
  margin-top: 0.5rem;
}

/* Ocultar scroll pero mantenerlo funcional */
.pendientes-lista {
  overflow-y: auto;
  padding-right: 0.5rem;
  max-height: calc(100vh - 170px);

  /* Para Firefox */
  scrollbar-width: none;
}

/* Para Chrome, Edge y Safari */
.pendientes-lista::-webkit-scrollbar {
  display: none;
}

.pendiente-card {
  background: #0f2527;
  border-radius: 16px;
  border: 1px solid rgba(6, 18, 20, 0.9);
  padding: 0.9rem 1rem;
  margin-bottom: 0.7rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.pendiente-header h3 {
  margin: 0;
  color: #facc15;
}

.pendiente-resumen {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  opacity: 0.85;
  margin-top: 0.2rem;
}

.pendiente-items {
  margin-top: 0.5rem;
  padding: 0.4rem 0.5rem;
  border-radius: 10px;
  background: #020818;
}

.pendiente-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.item-detalle {
  font-size: 0.75rem;
  opacity: 0.8;
}

.pendiente-botones {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.6rem;
  align-items: center;
}

.select-estado {
  min-width: 130px;
  border-radius: 999px;
  border: 1px solid rgba(250, 204, 21, 0.7);
  background: #020818;
  color: #f9fafb;
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
}

.btn-detalles,
.btn-hecho {
  flex: 1;
  border-radius: 999px;
  border: none;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: filter 0.15s ease, transform 0.1s ease;
}

.btn-detalles {
  background: transparent;
  border: 1px solid #facc15;
  color: #facc15;
}

.btn-hecho {
  background: #facc15;
  color: #0b1720;
}

.btn-detalles:hover,
.btn-hecho:hover {
  filter: brightness(1.05);
}

.btn-detalles:active,
.btn-hecho:active {
  transform: scale(0.97);
}

/* derecha: detalle */
.pendientes-detalle {
  overflow-y: auto;
  padding: 12px;

  width: 100%;
  max-height: calc(100vh - 170px);

  /* 🎨 Nuevo fondo combinando verde + azul */
  background: #1f3c45; /* verde azulado medio */
  border-radius: 12px;

  /* 🎨 Borde brillante suave */
  border: 2px solid #376961;
}

/* Título */
.detalle-title {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.05rem;
  color: #facc15; /* dorado */
}

/* Mensaje vacío */
.mensaje-vacio {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 1rem;
  color: #e8f5f2; /* casi blanco azul */
}

/* Contenedor de items */
.detalle-items {
  background: #294b55; /* más claro que el fondo */
  border-radius: 10px;
  padding: 0.6rem;
  margin-bottom: 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Cada item */
.detalle-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  margin-bottom: 0.35rem;
  color: #e6f7f4;
}

/* Campos */
.campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.6rem;
  font-size: 0.85rem;
  color: #e8f5f2;
}

.campo label {
  font-weight: 600;
  margin-bottom: 0.15rem;
  color: #d9f7ed;
}

.campo span {
  background: #294b55;
  border-radius: 6px;
  padding: 4px 7px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Select + Textarea */
.campo select,
.campo textarea {
  background: #294b55;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e9fffa;
  padding: 6px 8px;
  font-size: 0.85rem;
}

.subtitulo {
  margin-top: 0.7rem;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
  color: #8fd1c7; /* celeste-verde suave */
}

/* Botón guardar */
.btn-guardar {
  margin-top: 0.8rem;
  width: 100%;
  border-radius: 999px;
  border: none;
  padding: 0.55rem 0;
  background: #8fd1c7; /* acento verde agua */
  color: #0b1720;
  font-weight: 700;
  cursor: pointer;
  transition: 0.15s ease;
}

.btn-guardar:hover {
  background: #a4dfd6;
}

.btn-guardar {
  margin-top: 0.6rem;
  width: 100%;
  border-radius: 999px;
  border: none;
  padding: 0.45rem 0;
  background: #facc15;
  color: #0b1720;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.9rem;
  transition: filter 0.15s ease, transform 0.1s ease;
}

.btn-guardar:hover {
  filter: brightness(1.05);
}

.btn-guardar:active {
  transform: scale(0.97);
}

/* responsive */
@media (max-width: 900px) {
  .pendientes-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .pendientes-lista,
  .pendientes-detalle {
    max-height: none;
  }
}
</style>
