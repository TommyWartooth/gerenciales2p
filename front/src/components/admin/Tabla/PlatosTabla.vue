<template>
  <div class="table-wrapper">
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Costo unitario (S/.)</th>
          <th>Disponibilidad</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in platos" :key="p.id_plato">
          <td>{{ p.id_plato }}</td>
          <td>{{ p.nombre }}</td>
          <td>{{ p.costo_unitario.toFixed(2) }}</td>

          <!-- Texto de disponibilidad -->
          <td>
            <span
              :class="[
                'badge-estado',
                p.disponibilidad ? 'activo' : 'inactivo',
              ]"
            >
              {{ p.disponibilidad ? "Disponible" : "No disponibilidad" }}
            </span>
          </td>

          <!-- Botones -->
          <td>
            <button class="btn-accion btn-editar" @click="$emit('editar', p)">
              ✏️ Modificar
            </button>

            <button
              class="btn-accion btn-eliminar"
              @click="$emit('eliminar', p)"
            >
              🗑 Eliminar
            </button>
          </td>
        </tr>

        <tr v-if="!platos || platos.length === 0">
          <td colspan="5">No se encontraron platos.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  platos: {
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

/* Botones */
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
