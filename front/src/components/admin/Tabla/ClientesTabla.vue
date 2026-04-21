<template>
  <div class="tabla-wrap">
    <table class="admin-table">
      <thead>
        <tr>
          <th>Documento (CI)</th>
          <th>Nombre Completo</th>
          <th>NIT / Facturación</th>
          <th>Razón Social</th>
          <th>Correo</th>
          <th>Acción</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="c in clientes" :key="c.documento">
          <td>{{ c.documento }}</td>
          <td>{{ c.nombre }} {{ c.apellidos }}</td>
          <td>
            <span v-if="c.nit">{{ c.nit }}</span>
            <span v-else style="color: gray; font-size: 0.9em;">Consumidor Final</span>
          </td>
          <td>{{ c.razon_social || 'N/A' }}</td>
          <td>{{ c.correo }}</td>
          <td class="acciones"> 
            <button class="btn-delete" @click="$emit('eliminar', c)">
              🗑 Eliminar
            </button>
          </td>
        </tr>

        <tr v-if="!clientes || clientes.length === 0">
          <td colspan="6" class="tabla-vacia">No se encontraron clientes o cargando...</td>
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
/* Aquí hereda de tus estilos globales de admin.css o lo que pongas */
</style>
