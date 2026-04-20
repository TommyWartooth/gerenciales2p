<template>
  <section class="historial-container">
    <!-- HEADER -->
    <header class="historial-header">
      <div>
        <h1 class="historial-title">Historial de pedidos</h1>
        <p class="historial-sub">
          Pedidos hechos y cancelados registrados por recepción
        </p>
      </div>

      <div class="historial-filtros">
        <!-- filtro estado -->
        <label class="filtro-label">
          Estado:
          <select v-model="filtroEstado">
            <option value="todos">Todos</option>
            <option value="Hecho">Hechos</option>
            <option value="Cancelado">Cancelados</option>
          </select>
        </label>

        <!-- filtro texto -->
        <div class="filtro-busqueda">
          <input
            v-model="filtroTexto"
            type="text"
            placeholder="Buscar por cliente o NIT..."
          />
        </div>
      </div>
    </header>

    <!-- TABLA + DETALLE -->
    <div class="historial-layout">
      <!-- IZQUIERDA: tabla -->
      <div class="tabla-wrapper">
        <table class="tabla-pedidos">
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Modalidad</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Total (Bs.)</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="pedido in pedidosFiltrados"
              :key="pedido.id"
              :class="{
                'fila-seleccionada': pedidoSeleccionado?.id === pedido.id,
              }"
            >
              <td>{{ pedido.id }}</td>
              <td>
                <div class="celda-cliente">
                  <span class="cliente-nombre">{{ pedido.cliente }}</span>
                  <span class="cliente-nit" v-if="pedido.nit">
                    NIT: {{ pedido.nit }}
                  </span>
                </div>
              </td>
              <td>{{ pedido.modalidad }}</td>
              <td>
                <span
                  class="badge-estado"
                  :class="{
                    'badge-estado--finalizada': pedido.estado === 'Finalizada',
                    'badge-estado--cancelada': pedido.estado === 'Cancelada',
                  }"
                >
                  {{ pedido.estado }}
                </span>
              </td>
              <td>{{ pedido.fecha }}</td>
              <td>{{ pedido.hora }}</td>
              <td>{{ pedido.total.toFixed(2) }}</td>
              <td>
                <button
                  class="btn-detalle"
                  type="button"
                  @click="verDetalles(pedido)"
                >
                  Ver detalles
                </button>
              </td>
            </tr>

            <tr v-if="!pedidosFiltrados.length">
              <td colspan="8" class="tabla-vacia">
                No se encontraron pedidos con esos filtros.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- DERECHA: detalle -->
      <aside class="detalle-wrapper">
        <div v-if="pedidoSeleccionado" class="detalle-card">
          <h2 class="detalle-title">Pedido #{{ pedidoSeleccionado.id }}</h2>

          <p class="detalle-linea">
            <strong>Cliente:</strong> {{ pedidoSeleccionado.cliente }}
          </p>
          <p class="detalle-linea" v-if="pedidoSeleccionado.nit">
            <strong>NIT:</strong> {{ pedidoSeleccionado.nit }} ·
            <strong>Razón social:</strong> {{ pedidoSeleccionado.razonSocial }}
          </p>

          <p class="detalle-linea">
            <strong>Modalidad:</strong> {{ pedidoSeleccionado.modalidad }}
          </p>
          <p class="detalle-linea">
            <strong>Estado:</strong>
            <span
              class="badge-estado"
              :class="{
                'badge-estado--finalizada':
                  pedidoSeleccionado.estado === 'Finalizada',
                'badge-estado--cancelada':
                  pedidoSeleccionado.estado === 'Cancelada',
              }"
            >
              {{ pedidoSeleccionado.estado }}
            </span>
          </p>

          <p class="detalle-linea">
            <strong>Fecha y hora:</strong>
            {{ pedidoSeleccionado.fecha }} · {{ pedidoSeleccionado.hora }}
          </p>

          <p class="detalle-linea">
            <strong>Total:</strong>
            {{ pedidoSeleccionado.total.toFixed(2) }} Bs.
          </p>

          <p class="detalle-linea" v-if="pedidoSeleccionado.comentarios">
            <strong>Comentarios:</strong> {{ pedidoSeleccionado.comentarios }}
          </p>

          <h3 class="detalle-subtitle">Detalle de ítems</h3>
          <ul class="detalle-items">
            <li v-for="item in pedidoSeleccionado.items" :key="item.nombre">
              <div>
                <span class="detalle-item-nombre">{{ item.nombre }}</span>
                <span class="detalle-item-detalle">
                  x{{ item.cantidad }} · {{ item.detalle }}
                </span>
              </div>
              <span class="detalle-item-precio">
                {{ (item.precio * item.cantidad).toFixed(2) }} Bs.
              </span>
            </li>
          </ul>
        </div>

        <div v-else class="detalle-card detalle-card--placeholder">
          <p>
            Selecciona un pedido de la tabla para ver
            <strong>sus ítems y datos completos</strong> aquí.
          </p>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const pedidos = ref([]);
const filtroEstado = ref("todos");
const filtroTexto = ref("");
const pedidoSeleccionado = ref(null);
const cargando = ref(false);
const cargandoDetalle = ref(false);

async function cargarHistorial() {
  cargando.value = true;
  try {
    const res = await fetch("/api/pedidos/historial");
    console.log("GET /api/pedidos/historial →", res.status);
    if (!res.ok) {
      const txt = await res.text();
      console.error("Respuesta historial:", txt);
      throw new Error("Error al cargar historial");
    }

    const data = await res.json();
    console.log("Historial recibido:", data);

    pedidos.value = data.map((p) => ({
      id: p.id, // alias de nropedido
      cliente: p.cliente,
      nit: p.nit || "",
      razonSocial: p.razon_social || p.razonSocial || "",
      modalidad: p.modalidad,
      estado: p.estado, // "Hecho" o "Cancelado"
      fecha: p.fecha,
      hora: p.hora,
      total: Number(p.total ?? 0),
      comentarios: p.comentarios || "",
      items: [], // se llenan al ver detalles
    }));
  } catch (err) {
    console.error("Error cargando historial de pedidos:", err);
  } finally {
    cargando.value = false;
  }
}

// ===============================
const pedidosFiltrados = computed(() => {
  return pedidos.value
    .filter((p) => p.estado === "Hecho" || p.estado === "Cancelado")
    .filter((p) => {
      if (filtroEstado.value === "todos") return true;
      return p.estado === filtroEstado.value;
    })
    .filter((p) => {
      const texto = filtroTexto.value.trim().toLowerCase();
      if (!texto) return true;

      const cliente = (p.cliente || "").toLowerCase();
      const nit = (p.nit || "").toLowerCase();

      return cliente.includes(texto) || nit.includes(texto);
    });
});

async function verDetalles(pedidoResumen) {
  pedidoSeleccionado.value = null;
  cargandoDetalle.value = true;

  try {
    const res = await fetch(`/api/pedidos/${pedidoResumen.id}`);
    console.log(`GET /api/pedidos/${pedidoResumen.id} →`, res.status);

    if (!res.ok) {
      const txt = await res.text();
      console.error("Respuesta detalle:", txt);
      return;
    }

    const data = await res.json();
    console.log("Detalle recibido:", data);

    const items = (data.platos || []).map((pl) => ({
      nombre: pl.nombre,
      cantidad: pl.cantidad,
      detalle: "", // cuando tengas campo detalle, lo pones aquí
      precio: Number(pl.costo_unitario ?? pl.precio ?? 0),
    }));

    pedidoSeleccionado.value = {
      id: pedidoResumen.id,
      cliente: pedidoResumen.cliente,
      nit: pedidoResumen.nit,
      razonSocial: pedidoResumen.razonSocial,
      modalidad: pedidoResumen.modalidad,
      estado: pedidoResumen.estado,
      fecha: pedidoResumen.fecha,
      hora: pedidoResumen.hora,
      total: pedidoResumen.total,
      comentarios: pedidoResumen.comentarios,
      items,
    };
  } catch (err) {
    console.error("Error cargando detalle de pedido:", err);
  } finally {
    cargandoDetalle.value = false;
  }
}

// cargar historial al entrar a la vista
onMounted(cargarHistorial);
</script>

<style scoped>
.historial-container {
  padding: 0.75rem 0.5rem 1.5rem;
}

/* HEADER */
.historial-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 0.9rem;
}

.historial-title {
  margin: 0;
  font-size: 1.6rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #facc15; /* amarillo dorado */
}

.historial-sub {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: #cdd5d8;
}

.historial-filtros {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.filtro-label {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #e5e7eb;
}

.filtro-label select {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: #0e4745;
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  color: #fdf7ec;
}

.filtro-busqueda input {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  padding: 0.25rem 0.7rem;
  font-size: 0.8rem;
  width: 200px;
  background: #0e4745;
  color: #fdf7ec;
}

/* LAYOUT */
.historial-layout {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(260px, 2fr);
  gap: 1rem;
}

/* TABLA */
.tabla-wrapper {
  background: #0e4745; /* caja más oscura */
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  padding: 0.8rem 0.9rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.tabla-pedidos {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.tabla-pedidos thead {
  background: #14514f;
  color: #fdf7ec;
}

.tabla-pedidos th,
.tabla-pedidos td {
  padding: 0.45rem 0.4rem;
  text-align: left;
  color: #fdf7ec;
}

.tabla-pedidos th {
  font-weight: 600;
  font-size: 0.78rem;
}

.tabla-pedidos tbody tr:nth-child(even) {
  background: rgba(250, 250, 250, 0.05);
}

.tabla-pedidos tbody tr:hover {
  background: rgba(240, 201, 106, 0.15);
}

.fila-seleccionada {
  background: rgba(240, 201, 106, 0.25) !important;
}

.cliente-nombre {
  font-weight: 600;
}

.cliente-nit {
  font-size: 0.75rem;
  color: #cfd3d5;
}

.tabla-vacia {
  text-align: center;
  font-size: 0.85rem;
  padding: 0.8rem 0.4rem;
  color: #cfd3d5;
}

.btn-detalle {
  border-radius: 999px;
  border: 1px solid rgba(240, 201, 106, 0.9);
  background: transparent;
  font-size: 0.75rem;
  padding: 0.25rem 0.7rem;
  cursor: pointer;
  color: #facc15;
}

/* ESTADOS */
.badge-estado {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.1rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 700;
}

.badge-estado--finalizada {
  background: #22c55e33;
  color: #22c55e;
}

.badge-estado--cancelada {
  background: #b91c1c33;
  color: #f87171;
}

/* DETALLE */
.detalle-wrapper {
  display: flex;
  flex-direction: column;
}

.detalle-card {
  background: #0e4745;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  padding: 1rem;
  font-size: 0.85rem;
  color: #fdf7ec;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.detalle-card--placeholder {
  opacity: 0.7;
}

.detalle-title {
  margin: 0 0 0.4rem;
  font-size: 1.1rem;
  color: #facc15;
}

.detalle-subtitle {
  margin: 0.6rem 0 0.3rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #facc15;
}

.detalle-items li {
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  padding: 0.4rem 0.45rem;
  background: rgba(255, 255, 255, 0.05);
}

.detalle-item-nombre {
  font-weight: 600;
}

.detalle-item-detalle {
  display: block;
  font-size: 0.75rem;
  color: #cfd3d5;
}

.detalle-item-precio {
  font-weight: 600;
  color: #facc15;
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .historial-layout {
    grid-template-columns: 1fr;
  }
}
</style>
