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
    <div v-if="pedidoSeleccionado" class="admin-theme">
    <PedidoDetalleModal
      v-if="pedidoSeleccionado"
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
    ].some((campo) => campo.includes(b))
  );
});

const stats = computed(() => {
  const totalPedidos = pedidos.value.length;
  const ingresosTotalesNum = pedidos.value.reduce(
    (acc, p) => acc + (p.total || 0),
    0
  );
  const ingresosTotales = ingresosTotalesNum.toFixed(2);
  const entregasDomicilio = pedidos.value.filter(
    (p) => p.tipo_entrega.toLowerCase() === "domicilio"
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
/* Contenedor principal de la sección */
.admin-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: transparent;
  margin-top: 0 !important; 
  padding-top: 0 !important;
}

.admin-section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Alineado abajo para que el título mande */
  gap: 1rem;
  margin-top: -10px;
}

.breadcrumbs {
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.section-title {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-style: italic;
  color: var(--gold);
}

.section-desc {
  margin: 4px 0 0 0;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: var(--muted);
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

/* SEARCH INPUT - Forzado a OSCURO */
.search-input {
  background: var(--black-soft) !important;
  border: 1px solid rgba(235,205,149,0.15) !important;
  border-radius: 3px;
  color: var(--white) !important;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  padding: 0.55rem 1rem;
  outline: none;
  width: 260px;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--gold-dim) !important;
}

/* STATS - Tarjetas ejecutivas */
.stats-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-card {
  min-width: 180px;
  background: var(--black-soft); /* NEGRO SOFT */
  padding: 1.2rem;
  border-radius: 4px; /* Más cuadrado = más ejecutivo */
  border: 1px solid rgba(235,205,149,0.1); /* Borde oro casi invisible */
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

.stat-label {
  display: block;
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  color: var(--gold-dim);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.stat-value {
  font-family: 'Jost', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--white); /* NÚMEROS BLANCOS */
}
</style>