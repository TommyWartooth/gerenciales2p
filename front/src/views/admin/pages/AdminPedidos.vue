<template>
  <section class="admin-section">
    <header class="admin-section-header">
      <div>
        <div class="breadcrumbs">Administración / Pedidos</div>
        <h2 class="section-title">Pedidos realizados</h2>
        <p class="section-desc">
          Consulta y revisa los pedidos registrados en el sistema.
        </p>
      </div>

      <div class="section-actions">
        <input
          v-model="busqueda"
          type="text"
          class="search-input"
          placeholder="Buscar por ID o cliente..."
        />
      </div>
    </header>

    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-label">Pedidos totales</span>
        <span class="stat-value">{{ stats.totalPedidos }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Ingresos totales (Bs.)</span>
        <span class="stat-value">{{ stats.ingresosTotales }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Entregas a domicilio</span>
        <span class="stat-value">{{ stats.entregasDomicilio }}</span>
      </div>
    </div>

    <PedidosTabla :pedidos="pedidosFiltrados" @ver="verPedido" />

    <div v-if="pedidoSeleccionado" class="admin-theme">
      <PedidoDetalleModal
        :pedido="pedidoSeleccionado"
        @cerrar="pedidoSeleccionado = null"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import PedidosTabla from "../../../components/admin/Tabla/PedidosTabla.vue";
import PedidoDetalleModal from "../../../components/admin/Modal/PedidoDetalleModal.vue";
import '../../../assets/admin.css';

// ==========================
// DATOS MOCK
// ==========================
const pedidos = ref([
  {
    id: 1,
    cliente: "Juan Pérez",
    tipo_entrega: "Domicilio",
    cant_bebidas: 2,
    cant_postres: 1,
    cant_platos: 2,
    cant_entradas: 0,
    total: 165.0,
    fecha: "2025-12-01 19:30",
    direccion: "Av. Siempre Viva 123",
    referencia: "Frente a la plaza",
    telefono: "70000001",
    nit: "123456789",
    tipo_doc: "CI",
    items: [
      { tipo: "Entrada", nombre: "Pastel de Queso", cantidad: 1, precio_unitario: 15.0 },
      { tipo: "Plato fuerte", nombre: "Pique Macho Especial", cantidad: 1, precio_unitario: 80.0 },
      { tipo: "Plato fuerte", nombre: "Sajta de Pollo", cantidad: 1, precio_unitario: 50.0 },
      { tipo: "Bebida", nombre: "Mocochinchi Helado", cantidad: 2, precio_unitario: 10.0 },
    ],
  },
  {
    id: 2,
    cliente: "María López",
    tipo_entrega: "Local",
    cant_bebidas: 0,
    cant_postres: 1,
    cant_platos: 1,
    cant_entradas: 1,
    total: 45.0,
    fecha: "2025-12-01 20:10",
    direccion: null,
    referencia: null,
    telefono: "70000002",
    nit: null,
    tipo_doc: "Ninguno",
    items: [
      { tipo: "Plato fuerte", nombre: "Silpancho Cochabambino", cantidad: 1, precio_unitario: 65.0 },
      { tipo: "Postre", nombre: "Helado de Canela", cantidad: 1, precio_unitario: 15.0 },
      { tipo: "Bebida", nombre: "Huari 600ml", cantidad: 1, precio_unitario: 15.0 },
    ],
  },
]);

const busqueda = ref("");

const pedidosFiltrados = computed(() => {
  const b = busqueda.value.toLowerCase().trim();
  if (!b) return pedidos.value;

  return pedidos.value.filter((p) =>
    [
      p.id.toString(),
      p.cliente.toLowerCase(),
      p.tipo_entrega.toLowerCase(),
    ].some((campo) => campo.includes(b))
  );
});

const stats = computed(() => {
  const totalPedidos = pedidos.value.length;
  const ingresosTotalesNum = pedidos.value.reduce((acc, p) => acc + (p.total || 0), 0);
  const ingresosTotales = ingresosTotalesNum.toFixed(2);
  const entregasDomicilio = pedidos.value.filter(
    (p) => p.tipo_entrega.toLowerCase() === "domicilio"
  ).length;

  return { totalPedidos, ingresosTotales, entregasDomicilio };
});

const pedidoSeleccionado = ref(null);

function verPedido(p) {
  pedidoSeleccionado.value = p;
}
</script>

<style scoped>
.admin-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: transparent;
  padding: 0;
}

.admin-section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.breadcrumbs {
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.section-title {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-style: italic;
  color: #ebcd95; /* Gold */
}

.section-desc {
  margin: 4px 0 0 0;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #888;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.search-input {
  background: #1a1a1a !important;
  border: 1px solid rgba(235,205,149,0.15) !important;
  border-radius: 3px;
  color: #fff !important;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  padding: 0.55rem 1rem;
  outline: none;
  width: 260px;
}

.stats-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-card {
  min-width: 180px;
  background: #1a1a1a;
  padding: 1.2rem;
  border-radius: 4px;
  border: 1px solid rgba(235,205,149,0.1);
}

.stat-label {
  display: block;
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  color: #ebcd95;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.stat-value {
  font-family: 'Jost', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
}
</style>