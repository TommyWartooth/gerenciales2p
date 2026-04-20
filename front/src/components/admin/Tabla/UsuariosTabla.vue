<template>
  <div class="table-wrapper">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Documento (CI)</th>
          <th>Nombre completo</th>
          <th>Rol</th>
          <th>Fecha de contrato</th>
          <th>Celular</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="u in usuarios" :key="u.documento">
          <!-- DOCUMENTO -->
          <td>{{ u.documento }}</td>

          <!-- NOMBRE + APELLIDOS -->
          <td>{{ u.nombre }} {{ u.apellidos }}</td>

          <!-- ROL -->
          <td>{{ u.rolNombre }}</td>

          <!-- FECHA CONTRATO -->
          <td>{{ u.fecha_contrato }}</td>

          <!-- CELULAR -->
          <td>{{ u.celular }}</td>

          <!-- ACCIONES -->
          <td>
            <button class="btn-accion btn-editar" @click="$emit('editar', u)">
              ✏️ Modificar
            </button>

            <button
              class="btn-accion btn-eliminar"
              @click="$emit('eliminar', u)"
            >
              🗑 Eliminar
            </button>
          </td>
        </tr>

        <tr v-if="!usuarios || usuarios.length === 0">
          <td colspan="6">No se encontraron usuarios.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  usuarios: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.table-wrapper {
  margin-top: 8px;
  background: #fdf8ec;
  border-radius: 10px;
  border: 1px solid #d0c0a4;
  overflow: hidden;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.admin-table th,
.admin-table td {
  padding: 6px 10px;
  border-bottom: 1px solid #e0d2b8;
  text-align: center;
}

.admin-table thead {
  background: #f2e6cf;
}

.admin-table tbody tr:nth-child(odd) {
  background: #fbf6ec;
}

.admin-table tbody tr:hover {
  background: #f1ede5;
}

/* Estado */
.badge-estado {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.badge-estado.activo {
  background: #e0f3e2;
  color: #256635;
}

.badge-estado.inactivo {
  background: #f9e0de;
  color: #8a2e2a;
}

/* Botones de acción */
.btn-accion {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #d0c0a4;
  background: #f7f1e3;
  cursor: pointer;
  font-size: 0.8rem;
  margin: 0 2px;
}

.btn-accion:hover {
  background: #e7f0e9;
}

.btn-eliminar {
  background: #f9e0de;
}

.btn-eliminar:hover {
  background: #f4c7c3;
}
</style>
