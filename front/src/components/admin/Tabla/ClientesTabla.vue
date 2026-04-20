<template>
  <div class="tabla-wrap">
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
          <td class="acciones"> <button class="btn-delete" @click="$emit('eliminar', c)">
              🗑 Eliminar
            </button>
          </td>
        </tr>

        <tr v-if="!clientes || clientes.length === 0">
          <td colspan="5" class="tabla-vacia">No se encontraron clientes.</td>
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

</style>