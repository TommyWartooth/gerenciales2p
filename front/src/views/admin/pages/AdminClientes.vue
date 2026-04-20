<template>
  <section class="admin-section">
    <!-- CABECERA -->
    <header class="admin-section-header">
      <div>
        <div class="breadcrumbs">Administración / Clientes</div>
        <h2 class="section-title">Clientes</h2>
        <p class="section-desc">
          Consulta los clientes registrados y gestiona sus datos básicos.
        </p>
      </div>

      <div class="section-actions">
        <select v-model="filtroDoc" class="select-doc">
          <option value="todos">Todos los tipos</option>
          <option value="NIT">NIT</option>
          <option value="Carnet">Carnet</option>
          <option value="Ninguno">Ninguno</option>
        </select>

        <input
          v-model="busqueda"
          type="text"
          class="search-input"
          placeholder="Buscar por nombre, correo o documento..."
        />
      </div>
    </header>

    <!-- STATS -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-label">Total clientes</span>
        <span class="stat-value">{{ stats.total }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Con NIT</span>
        <span class="stat-value">{{ stats.conNIT }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Con Carnet</span>
        <span class="stat-value">{{ stats.conCarnet }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Sin doc. (Ninguno)</span>
        <span class="stat-value">{{ stats.sinDoc }}</span>
      </div>
    </div>

    <!-- TABLA -->
    <ClientesTabla :clientes="clientesFiltrados" @eliminar="eliminarCliente" />
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import ClientesTabla from "@/components/admin/Tabla/ClientesTabla.vue";

// ==========================
// DATOS MOCK (luego BD)
// ==========================
// 👇 Ahora la clave es "documento"
const clientes = ref([
  {
    documento: "12345678",
    nombre: "Juan",
    apellido: "Pérez",
    tipo_doc: "NIT",
    correo: "juan.perez@example.com",
  },
  {
    documento: "87654321",
    nombre: "Mauricio",
    apellido: "López",
    tipo_doc: "Carnet",
    correo: "maria.lopez@example.com",
  },
  {
    documento: "99999999",
    nombre: "Carlos",
    apellido: "Rojas",
    tipo_doc: "Ninguno",
    correo: "carlos.rojas@example.com",
  },
]);

// ==========================
// FILTRO + BUSQUEDA
// ==========================
const busqueda = ref("");
const filtroDoc = ref("todos");

const clientesFiltrados = computed(() => {
  const b = busqueda.value.toLowerCase().trim();
  const doc = filtroDoc.value;

  return clientes.value.filter((c) => {
    const nombreCompleto = `${c.nombre} ${c.apellido}`.toLowerCase();

    const coincideTexto =
      !b ||
      (c.documento && c.documento.toString().includes(b)) ||
      nombreCompleto.includes(b) ||
      (c.correo && c.correo.toLowerCase().includes(b));

    const coincideDoc =
      doc === "todos" || c.tipo_doc.toLowerCase() === doc.toLowerCase();

    return coincideTexto && coincideDoc;
  });
});

// ==========================
// STATS
// ==========================
const stats = computed(() => {
  const total = clientes.value.length;
  const conNIT = clientes.value.filter(
    (c) => c.tipo_doc.toLowerCase() === "nit",
  ).length;
  const conCarnet = clientes.value.filter(
    (c) => c.tipo_doc.toLowerCase() === "carnet",
  ).length;
  const sinDoc = clientes.value.filter(
    (c) => c.tipo_doc.toLowerCase() === "ninguno",
  ).length;

  return { total, conNIT, conCarnet, sinDoc };
});

// ==========================
// ELIMINAR
// ==========================
// ahora eliminamos por "documento"
function eliminarCliente(cliente) {
  console.log("Eliminar cliente:", cliente);
  clientes.value = clientes.value.filter(
    (c) => c.documento !== cliente.documento,
  );
}
</script>

<style scoped>
.admin-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* CABECERA */
.admin-section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
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
  gap: 8px;
}

.search-input,
.select-doc {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d0c0a4;
  background: #fdf8ec;
  font-size: 0.85rem;
}

/* STATS */
.stats-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-card {
  min-width: 160px;
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
