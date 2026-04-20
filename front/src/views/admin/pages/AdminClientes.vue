<template>
  <div class="admin-theme admin-page">
    <section class="admin-section">
      
      <header class="admin-section-header">
        <div>
          <div class="breadcrumbs">Administración / Clientes</div>
          <h2 class="section-title">Clientes</h2>
          <p class="section-desc">
            Consulta los clientes registrados y gestiona sus datos básicos.
          </p>
        </div>

        <div class="section-actions">
          <select v-model="filtroDoc" class="admin-input-search" style="width: auto;">
            <option value="todos">Todos los tipos</option>
            <option value="NIT">NIT</option>
            <option value="Carnet">Carnet</option>
            <option value="Ninguno">Ninguno</option>
          </select>

          <input
            v-model="busqueda"
            type="text"
            class="admin-input-search"
            placeholder="Buscar por nombre o documento..."
          />
        </div>
      </header>

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

      <ClientesTabla :clientes="clientesFiltrados" @eliminar="eliminarCliente" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ClientesTabla from "../../../components/admin/Tabla/ClientesTabla.vue";
import "../../../assets/admin.css";

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
    (c) => c.tipo_doc.toLowerCase() === "nit"
  ).length;
  const conCarnet = clientes.value.filter(
    (c) => c.tipo_doc.toLowerCase() === "carnet"
  ).length;
  const sinDoc = clientes.value.filter(
    (c) => c.tipo_doc.toLowerCase() === "ninguno"
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
    (c) => c.documento !== cliente.documento
  );
}
</script>

<style scoped>
.admin-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem; 
  margin-top: 0 !important; 
  padding-top: 0 !important;
}

/* CABECERA */
.admin-section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
  font-size: 1.6rem;
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

/* INPUTS DE BÚSQUEDA Y SELECTS */
.search-input,
.select-doc {
  background: var(--black-soft);
  border: 1px solid rgba(235, 205, 149, 0.15);
  border-radius: 3px;
  color: var(--white);
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  padding: 0.55rem 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus,
.select-doc:focus {
  border-color: var(--gold-dim);
}

.select-doc {
  cursor: pointer;
}

/* STATS (TARJETAS DE INDICADORES) */
.stats-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-card {
  min-width: 160px;
  background: var(--black-soft); /* Fondo oscuro */
  padding: 1rem 1.2rem;
  border-radius: 4px; /* Más recto y serio */
  border: 1px solid rgba(235, 205, 149, 0.1);
  transition: transform 0.2s, border-color 0.2s;
}

.stat-card:hover {
  border-color: var(--wine-light);
  transform: translateY(-2px);
}

.stat-label {
  display: block;
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  color: var(--gold-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.stat-value {
  font-family: 'Jost', sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--white);
}
</style>
