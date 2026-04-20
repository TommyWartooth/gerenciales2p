<template>
  <table class="tabla-admin">
    <thead>
      <tr>
        <th>ID</th>
        <th>Cliente</th>
        <th>Tipo entrega</th>
        <th>Beb.</th>
        <th>Entr.</th>
        <th>Platos</th>
        <th>Postres</th>
        <th>Total (S/.)</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in pedidos" :key="p.id">
        <td>{{ p.id }}</td>
        <td>{{ p.cliente }}</td>
        <td>{{ p.tipo_entrega }}</td>
        <td>{{ p.cant_bebidas }}</td>
        <td>{{ p.cant_entradas }}</td>
        <td>{{ p.cant_platos }}</td>
        <td>{{ p.cant_postres }}</td>
        <td>{{ p.total.toFixed(2) }}</td>
        <td>
          <button class="btn-ver" @click="$emit('ver', p)">Ver</button>
        </td>
      </tr>
      <tr v-if="!pedidos.length">
        <td colspan="9" class="tabla-vacia">No hay pedidos registrados.</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  pedidos: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["ver"]);
</script>

<style scoped>
.tabla-admin {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.tabla-admin th,
.tabla-admin td {
  padding: 8px 10px;
  border-bottom: 1px solid #e2d6c3;
  text-align: left;
}

.tabla-admin thead {
  background: #f3e6cf;
}

.btn-ver {
  padding: 4px 10px;
  font-size: 0.8rem;
  border-radius: 6px;
  border: 1px solid #b9985b;
  background: #fdf3d8;
  cursor: pointer;
}

.btn-ver:hover {
  background: #f7e3b4;
}

.tabla-vacia {
  text-align: center;
  padding: 16px 0;
  color: #8a7a63;
}
</style>
