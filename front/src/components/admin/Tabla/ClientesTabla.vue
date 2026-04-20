<template>
  <div class="table-wrapper">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Documento (CI)</th>
          <th>Nombre</th>
          <th>Doc. facturación</th>
          <th>Correo</th>
          <th>Acción</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="c in clientes" :key="c.documento">
          <td>{{ c.documento }}</td>

          <td>{{ c.nombre }} {{ c.apellido }}</td>

          <td>{{ c.tipo_doc }}</td>

          <td>{{ c.correo }}</td>

          <td>
            <button class="btn-eliminar" @click="$emit('eliminar', c)">
              🗑 Eliminar
            </button>
          </td>
        </tr>

        <tr v-if="!clientes || clientes.length === 0">
          <td colspan="5">No se encontraron clientes.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps({
  clientes: {
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

/* Botón eliminar */
.btn-eliminar {
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #d7a4a0;
  background: #f9e0de;
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-eliminar:hover {
  background: #f4c7c3;
}
</style>
