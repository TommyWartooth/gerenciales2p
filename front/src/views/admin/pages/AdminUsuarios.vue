<template>
  <section class="admin-section">
    <!-- CABECERA -->
    <header class="admin-section-header">
      <div>
        <div class="breadcrumbs">Administración / Personal</div>
        <h2 class="section-title">Personal</h2>
        <p class="section-desc">
          Gestiona el personal del restaurante y sus roles.
        </p>
      </div>

      <div class="section-actions">
        <button class="btn-agregar" @click="abrirNuevoPersonal">
          + Nuevo personal
        </button>

        <input
          v-model="busqueda"
          type="text"
          class="search-input"
          placeholder="Buscar por nombre, rol o documento..."
        />
      </div>
    </header>

    <!-- STATS -->
    <div class="stats-row">
      <div class="stat-card">
        <span class="stat-label">Total personal</span>
        <span class="stat-value">{{ stats.total }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Activos</span>
        <span class="stat-value">{{ stats.activos }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Recepcionistas</span>
        <span class="stat-value">{{ stats.recepcionistas }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Cocineros</span>
        <span class="stat-value">{{ stats.cocineros }}</span>
      </div>
    </div>

    <!-- TABLA -->
    <UsuariosTabla
      :usuarios="usuariosFiltrados"
      @editar="editarUsuario"
      @eliminar="eliminarUsuario"
    />

    <!-- MODALES -->
    <NuevoPersonalModal
      v-if="mostrarModalNuevo"
      @cerrar="mostrarModalNuevo = false"
      @guardado="agregarPersonal"
    />

    <EditarPersonalModal
      v-if="usuarioEditando"
      :usuario="usuarioEditando"
      @cerrar="usuarioEditando = null"
      @actualizar="actualizarUsuario"
    />
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import UsuariosTabla from "@/components/admin/Tabla/UsuariosTabla.vue";
import NuevoPersonalModal from "@/components/admin/Modal/NuevoPersonalModal.vue";
import EditarPersonalModal from "@/components/admin/Modal/EditarPersonalModal.vue";

const usuarioEditando = ref(null);
const mostrarModalNuevo = ref(false);

// ==========================
// DATOS MOCK — ahora el CI es el identificador
// ==========================
const usuarios = ref([
  {
    documento: "12345678",
    nombre: "Ana",
    apellidos: "Pérez",
    fecha_nac: "1995-04-10",
    correo: "ana.perez@example.com",
    contrasena: "123456",
    celular: "70000001",
    telefono_fijo: "2245678",
    idTipo: 2,
    idRol: 2,
    rolNombre: "Recepcionista",
    fecha_contrato: "2023-01-10",
    activo: true,
  },
  {
    documento: "87654321",
    nombre: "Luis",
    apellidos: "García",
    fecha_nac: "1990-07-22",
    correo: "luis.garcia@example.com",
    contrasena: "abcdef",
    celular: "70000002",
    telefono_fijo: "2233445",
    idTipo: 2,
    idRol: 3,
    rolNombre: "Cocinero",
    fecha_contrato: "2022-11-05",
    activo: true,
  },
  {
    documento: "99887766",
    nombre: "María",
    apellidos: "López",
    fecha_nac: "1988-02-15",
    correo: "maria.lopez@example.com",
    contrasena: "qwerty",
    celular: "70000003",
    telefono_fijo: "2277889",
    idTipo: 2,
    idRol: 1,
    rolNombre: "Administrador",
    fecha_contrato: "2021-06-20",
    activo: true,
  },
  {
    documento: "44556677",
    nombre: "Carlos",
    apellidos: "Rojas",
    fecha_nac: "1992-12-03",
    correo: "carlos.rojas@example.com",
    contrasena: "password",
    celular: "70000004",
    telefono_fijo: "2211223",
    idTipo: 2,
    idRol: 2,
    rolNombre: "Recepcionista",
    fecha_contrato: "2022-03-15",
    activo: false,
  },
]);

// ==========================
// FILTRO
// ==========================
const busqueda = ref("");

const usuariosFiltrados = computed(() => {
  const b = busqueda.value.toLowerCase().trim();
  if (!b) return usuarios.value;

  return usuarios.value.filter((u) => {
    const nombreCompleto = `${u.nombre} ${u.apellidos}`.toLowerCase();

    return (
      u.documento.includes(b) ||
      nombreCompleto.includes(b) ||
      u.rolNombre.toLowerCase().includes(b)
    );
  });
});

// ==========================
// STATS
// ==========================
const stats = computed(() => {
  const total = usuarios.value.length;
  const activos = usuarios.value.filter((u) => u.activo).length;
  const recepcionistas = usuarios.value.filter(
    (u) => u.rolNombre.toLowerCase() === "recepcionista",
  ).length;
  const cocineros = usuarios.value.filter(
    (u) => u.rolNombre.toLowerCase() === "cocinero",
  ).length;

  return { total, activos, recepcionistas, cocineros };
});

// ==========================
// ACCIONES CRUD
// ==========================
function abrirNuevoPersonal() {
  mostrarModalNuevo.value = true;
}

function editarUsuario(usuario) {
  usuarioEditando.value = { ...usuario };
}

function actualizarUsuario(actualizado) {
  const idx = usuarios.value.findIndex(
    (u) => u.documento === actualizado.documento,
  );
  if (idx !== -1) usuarios.value[idx] = actualizado;
  usuarioEditando.value = null;
}

function eliminarUsuario(usuario) {
  const ok = confirm(`¿Seguro que quieres eliminar a ${usuario.nombre}?`);
  if (!ok) return;

  usuarios.value = usuarios.value.filter(
    (u) => u.documento !== usuario.documento,
  );
}

// crear usuario
function agregarPersonal(nuevo) {
  usuarios.value.push({
    ...nuevo,
    rolNombre: nuevo.rolNombre,
    activo: true,
  });

  mostrarModalNuevo.value = false;
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

.search-input {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d0c0a4;
  background: #fdf8ec;
}

/* Botón agregar */
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
