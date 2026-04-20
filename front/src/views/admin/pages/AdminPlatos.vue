<template>
  <section class="admin-section">
    <!-- CABECERA -->
    <header class="admin-section-header">
      <div>
        <div class="breadcrumbs">Administración / Platos</div>
        <h2 class="section-title">Platos del menú</h2>
        <p class="section-desc">
          Gestión de bebidas, entradas, platos fuertes y postres.
        </p>
      </div>

      <div class="section-actions">
        <button class="btn-agregar" @click="abrirNuevoPlato">
          + Crear plato
        </button>
        <!-- luego aquí irá el botón "Crear plato" -->
        <select v-model.number="filtroTipo" class="select-tipo">
          <option :value="0">Todos los tipos</option>
          <option
            v-for="c in categorias"
            :key="c.idcategoria"
            :value="c.idcategoria"
          >
            {{ c.nombre }}
          </option>
        </select>

        <input
          v-model="busqueda"
          type="text"
          class="search-input"
          placeholder="Buscar por nombre o ID..."
        />
      </div>
    </header>

    <!-- STATS -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-label">Total platos</span>
        <span class="stat-value">{{ stats.total }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Disponibles</span>
        <span class="stat-value">{{ stats.disponibilidad }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Bebidas</span>
        <span class="stat-value">{{ stats.bebidas }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Platos fuertes</span>
        <span class="stat-value">{{ stats.platosFuertes }}</span>
      </div>
    </div>

    <!-- TABLA -->
    <PlatosTabla
      :platos="platosFiltrados"
      @editar="editarPlato"
      @eliminar="eliminarPlato"
      @toggle-disponibilidad="toggleDisponibilidad"
    />

    <EditarPlatoModal
      v-if="platoEditando"
      :plato="platoEditando"
      :categorias="categorias"
      @cerrar="platoEditando = null"
      @actualizar="actualizarPlato"
    />
    <NuevoPlatoModal
      v-if="mostrarModalNuevo"
      :categorias="categorias"
      @cerrar="mostrarModalNuevo = false"
      @guardar="agregarPlato"
    />
  </section>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";

import PlatosTabla from "@/components/admin/Tabla/PlatosTabla.vue";
import EditarPlatoModal from "@/components/admin/Modal/EditarPlatoModal.vue";
import NuevoPlatoModal from "@/components/admin/Modal/NuevoPlatoModal.vue";

const platoEditando = ref(null);
const mostrarModalNuevo = ref(false);

function abrirNuevoPlato() {
  mostrarModalNuevo.value = true;
}

const platos = ref([]);
// mock de categorías (luego vendrán de la BD)
const categorias = ref([
  { idcategoria: 1, nombre: "Bebidas" },
  { idcategoria: 2, nombre: "Platos fuertes" },
  { idcategoria: 3, nombre: "Entradas" },
  { idcategoria: 4, nombre: "Postres" },
]);

async function cargarPlatos() {
  try {
    const resp = await fetch("http://localhost:3000/api/platos");
    if (!resp.ok) throw new Error("Error al obtener platos");

    const data = await resp.json();

    platos.value = data.map((p) => ({
      id_plato: p.id,
      nombre: p.nombre,
      costo_unitario: Number(p.costo_unitario),
      descripcion: p.descripcion,
      disponibilidad: p.disponibilidad,
      tipo:
        categorias.value.find((c) => c.idcategoria === p.idcategoria)?.nombre ||
        "",
      idcategoria: p.idcategoria,
      imagen: p.imagen,
    }));

    console.log("PLATOS DESDE BD:", platos.value);
  } catch (err) {
    console.error("Error cargando platos:", err);
  }
}

onMounted(() => {
  cargarPlatos();
});
// ==========================
// AGREGAR NUEVO PLATO
// ==========================
async function agregarPlato(nuevo) {
  try {
    const body = {
      nombre: nuevo.nombre,
      costo_unitario: Number(nuevo.costo_unitario),
      descripcion: nuevo.descripcion,
      disponibilidad: nuevo.disponibilidad,
      imagen: nuevo.imagen || null,
      idcategoria: nuevo.idcategoria,
    };

    const resp = await fetch("http://localhost:3000/api/platos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      throw new Error("Error al crear plato");
    }

    const data = await resp.json();
    const platoDb = data.plato;
    const platoCreado = {
      id_plato: platoDb.id,
      nombre: platoDb.nombre,
      costo_unitario: platoDb.costo_unitario,
      descripcion: platoDb.descripcion,
      disponibilidad: platoDb.disponibilidad,
      tipo: nuevo.tipo || null,
      idcategoria: platoDb.idcategoria,
      imagen: platoDb.imagen,
    };

    platos.value.push(platoCreado);

    console.log("PLATO CREADO EN BD:", platoCreado);
    mostrarModalNuevo.value = false;
  } catch (error) {
    console.error(" Error al crear plato:", error);
    alert(error.message || "No se pudo crear el plato.");
  }
}

// ==========================
// FILTRO Y BUSCADOR
// ==========================
const busqueda = ref("");
const filtroTipo = ref("todos");
const platosFiltrados = computed(() => {
  const b = busqueda.value.toLowerCase().trim();
  const cat = filtroTipo.value;

  return platos.value.filter((p) => {
    const coincideTexto =
      !b ||
      p.nombre.toLowerCase().includes(b) ||
      p.id_plato.toString().includes(b);

    const coincideCategoria = cat === 0 || p.idcategoria === cat;

    return coincideTexto && coincideCategoria;
  });
});

// ==========================
// STATS
// ==========================
const stats = computed(() => {
  const total = platos.value.length;
  const disponibilidad = platos.value.filter((p) => p.disponibilidad).length;

  const bebidas = platos.value.filter((p) => p.idcategoria === 1).length;
  const platosFuertes = platos.value.filter((p) => p.idcategoria === 2).length;

  return { total, disponibilidad, bebidas, platosFuertes };
});
// ==========================
// ACCIONES
// ==========================
function editarPlato(plato) {
  console.log("Editar plato:", plato);
  platoEditando.value = { ...plato };
}

async function actualizarPlato(actualizado) {
  try {
    const body = {
      nombre: actualizado.nombre,
      costo_unitario: Number(actualizado.costo_unitario),
      descripcion: actualizado.descripcion,
      disponibilidad: actualizado.disponibilidad,
      imagen: actualizado.imagen || null,
      idcategoria: actualizado.idcategoria,
    };

    const resp = await fetch(
      `http://localhost:3000/api/platos/${actualizado.id_plato}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!resp.ok) throw new Error("Error al actualizar plato");

    const data = await resp.json();
    const platoDb = data.plato; // lo que devuelve tu controller

    const platoActualizado = {
      id_plato: platoDb.idplato, // porque tu modelo Plato usa id = idplato
      nombre: platoDb.nombre,
      costo_unitario: Number(platoDb.costo_unitario),
      descripcion: platoDb.descripcion,
      disponibilidad: platoDb.disponibilidad,
      tipo:
        categorias.value.find((c) => c.idcategoria === platoDb.idcategoria)
          ?.nombre || "",
      idcategoria: platoDb.idcategoria,
      imagen: platoDb.imagen,
    };

    const idx = platos.value.findIndex(
      (p) => p.id_plato === platoActualizado.id_plato,
    );
    if (idx !== -1) {
      platos.value[idx] = platoActualizado;
    }

    platoEditando.value = null;
    console.log("PLATO ACTUALIZADO EN BD:", platoActualizado);
    alert("plato actualizado");
  } catch (error) {
    console.error("Error al actualizar plato:", error);
    alert(error.message || "No se pudo actualizar el plato.");
  }
}

function toggleDisponibilidad(plato) {
  const target = platos.value.find((p) => p.id_plato === plato.id_plato);
  if (target) target.disponibilidad = !target.disponibilidad;
  console.log("Toggle disponibilidad:", target);
}

async function eliminarPlato(plato) {
  const ok = confirm(
    `¿Seguro que quieres eliminar el plato "${plato.nombre}"?`,
  );
  if (!ok) return;

  try {
    const resp = await fetch(
      `http://localhost:3000/api/platos/${plato.id_plato}`,
      {
        method: "DELETE",
      },
    );

    if (!resp.ok) throw new Error("Error al eliminar plato");

    // Quitar del array local
    platos.value = platos.value.filter((p) => p.id_plato !== plato.id_plato);

    console.log("PLATO ELIMINADO:", plato);
  } catch (err) {
    console.error("Error eliminando plato:", err);
    alert("No se pudo eliminar el plato.");
  }
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
.select-tipo {
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
.btn-agregar {
  background: #2f6b5f;
  color: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 0 #234f45;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
}

.btn-agregar:hover {
  background: #285e53;
}
</style>
