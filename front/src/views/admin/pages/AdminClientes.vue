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
            <option value="todos">Todos los clientes</option>
            <option value="con_nit">Con NIT</option>
            <option value="sin_nit">Sin NIT (Solo CI)</option>
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
          <span class="stat-label">Con NIT Registrado</span>
          <span class="stat-value">{{ stats.conNIT }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Sin NIT (Consumidor Final)</span>
          <span class="stat-value">{{ stats.sinNIT }}</span>
        </div>
      </div>

      <ClientesTabla :clientes="clientesFiltrados" @eliminar="eliminarCliente" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ClientesTabla from "../../../components/admin/Tabla/ClientesTabla.vue";
import "../../../assets/admin.css";

// Estado de los clientes traídos de la BD
const clientes = ref([]);

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

// ==========================
// CARGAR DESDE LA API
// ==========================
const cargarClientes = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/usuarios/clientes', {
      headers: getHeaders()
    });
    if (res.ok) {
      clientes.value = await res.json();
    } else {
      console.error("Error al cargar clientes");
    }
  } catch (error) {
    console.error("Error de conexión:", error);
  }
}

onMounted(() => {
  cargarClientes();
});

// ==========================
// FILTRO + BUSQUEDA
// ==========================
const busqueda = ref("");
const filtroDoc = ref("todos");

const clientesFiltrados = computed(() => {
  const b = busqueda.value.toLowerCase().trim();
  const doc = filtroDoc.value;

  return clientes.value.filter((c) => {
    const nombreCompleto = `${c.nombre} ${c.apellidos}`.toLowerCase();

    // Buscar por texto (CI, Nombre o Correo)
    const coincideTexto =
      !b ||
      (c.documento && c.documento.toString().includes(b)) ||
      nombreCompleto.includes(b) ||
      (c.correo && c.correo.toLowerCase().includes(b)) ||
      (c.nit && c.nit.toLowerCase().includes(b));

    // Filtrar por estado del NIT
    let coincideDoc = true;
    if (doc === "con_nit") {
      coincideDoc = c.nit && c.nit.trim() !== "";
    } else if (doc === "sin_nit") {
      coincideDoc = !c.nit || c.nit.trim() === "";
    }

    return coincideTexto && coincideDoc;
  });
});

// ==========================
// STATS
// ==========================
const stats = computed(() => {
  const total = clientes.value.length;
  const conNIT = clientes.value.filter(c => c.nit && c.nit.trim() !== "").length;
  const sinNIT = total - conNIT;

  return { total, conNIT, sinNIT };
});

// ==========================
// ELIMINAR
// ==========================
async function eliminarCliente(cliente) {
  if (confirm(`¿Estás seguro de eliminar al cliente ${cliente.nombre} ${cliente.apellidos}?`)) {
    try {
      // Como el borrado de clientes no lo armamos en el controller (solo el de personal), 
      // de momento lo borramos del frontend. 
      // ¡Aviso!: Si quieres que se borre de la BD real, deberás hacer la ruta DELETE en backend.
      
      /* Si tuvieras la ruta hecha, harías esto:
      const res = await fetch(`http://localhost:3000/api/usuarios/clientes/${cliente.documento}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        await cargarClientes();
      }
      */
      
      // Simulación de borrado local por ahora
      clientes.value = clientes.value.filter(c => c.documento !== cliente.documento);
      console.log("Cliente eliminado localmente.");

    } catch (error) {
      console.error(error);
    }
  }
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
