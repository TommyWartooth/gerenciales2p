<template>
  <section class="admin-section">
    <!-- CABECERA -->
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

    <!-- TARJETAS DE STATS -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-label">Pedidos totales</span>
        <span class="stat-value">{{ stats.totalPedidos }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Ingresos totales (S/.)</span>
        <span class="stat-value">{{ stats.ingresosTotales }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Entregas a domicilio</span>
        <span class="stat-value">{{ stats.entregasDomicilio }}</span>
      </div>
    </div>

    <!-- TABLA -->
    <PedidosTabla :pedidos="pedidosFiltrados" @ver="verPedido" />

    <!-- MODAL DETALLE PEDIDO -->
    <PedidoDetalleModal
      v-if="pedidoSeleccionado"
      :pedido="pedidoSeleccionado"
      @cerrar="pedidoSeleccionado = null"
    />
  </section>
</template>
<script setup>
import { ref, computed } from "vue";
import PedidosTabla from "@/components/admin/Tabla/PedidosTabla.vue";
import PedidoDetalleModal from "@/components/admin/Modal/PedidoDetalleModal.vue";

// ==========================
// DATOS MOCK (luego BD)
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
    total: 75.5,
    fecha: "2025-12-01 19:30",
    direccion: "Av. Siempre Viva 123",
    referencia: "Frente a la plaza",
    telefono: "70000001",
    nit: "123456789",
    tipo_doc: "CI",
    // 👇 detalle del pedido
    items: [
      {
        tipo: "Plato fuerte",
        nombre: "Lomo Saltado",
        cantidad: 2,
        precio_unitario: 25.0,
      },
      {
        tipo: "Postre",
        nombre: "Suspiro a la Limeña",
        cantidad: 1,
        precio_unitario: 12.5,
      },
      {
        tipo: "Bebida",
        nombre: "Chicha Morada",
        cantidad: 2,
        precio_unitario: 6.5,
      },
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
      {
        tipo: "Entrada",
        nombre: "Causa Limeña",
        cantidad: 1,
        precio_unitario: 10.0,
      },
      {
        tipo: "Plato fuerte",
        nombre: "Ají de Gallina",
        cantidad: 1,
        precio_unitario: 25.0,
      },
      {
        tipo: "Postre",
        nombre: "Picarones",
        cantidad: 1,
        precio_unitario: 10.0,
      },
    ],
  },
]);

// (lo demás igual)
const busqueda = ref("");

const pedidosFiltrados = computed(() => {
  const b = busqueda.value.toLowerCase().trim();
  if (!b) return pedidos.value;

  return pedidos.value.filter((p) =>
    [
      p.id.toString(),
      p.cliente.toLowerCase(),
      p.tipo_entrega.toLowerCase(),
    ].some((campo) => campo.includes(b)),
  );
});

const stats = computed(() => {
  const totalPedidos = pedidos.value.length;
  const ingresosTotalesNum = pedidos.value.reduce(
    (acc, p) => acc + (p.total || 0),
    0,
  );
  const ingresosTotales = ingresosTotalesNum.toFixed(2);
  const entregasDomicilio = pedidos.value.filter(
    (p) => p.tipo_entrega.toLowerCase() === "domicilio",
  ).length;

  return {
    totalPedidos,
    ingresosTotales,
    entregasDomicilio,
  };
});

const pedidoSeleccionado = ref(null);

function verPedido(p) {
  pedidoSeleccionado.value = p;
}
</script>

<style scoped>
/* lo que ya tenías, igualito */
.admin-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.admin-section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.breadcrumbs {
  font-size: 0.85rem;
  color: #6d5e4a;
  margin-bottom: 4px;
}

.section-title {
  margin: 0;
  font-size: 1.4rem;
  color: #3b2f22;
}

.section-desc {
  margin: 2px 0 0 0;
  font-size: 0.9rem;
  color: #6d5e4a;
}

.section-actions {
  display: flex;
  align-items: center;
}

.search-input {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d0c0a4;
  background: #fdf8ec;
}

.stats-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-card {
  min-width: 180px;
  background: #f7f1e3;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #d0c0a4;
  box-shadow: 0 2px 0 #c6b69a;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #6d5e4a;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #3b2f22;
}
</style>
