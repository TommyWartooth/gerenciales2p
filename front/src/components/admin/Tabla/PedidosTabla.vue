<template>
  <div class="tabla-wrap">
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Entrega</th>
          <th>Bebida</th>
          <th>Entrada</th>
          <th>Plat. Fuerte</th>
          <th>Postre.</th>
          <th>Total</th>
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
          <td style="color: var(--gold); font-weight: bold;">
            Bs. {{ p.total.toFixed(2) }}
          </td>
          <td class="acciones">
            <button class="btn-edit" @click="$emit('ver', p)">
              Ver
            </button>
          </td>
        </tr>
        
        <tr v-if="!pedidos.length">
          <td colspan="9" class="tabla-vacia">
            No hay pedidos registrados.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  pedidos: { type: Array, default: () => [] }
});
defineEmits(["ver"]);
</script>

<style scoped>
/* BORRAMOS TODO. 
   El componente ahora es "ligero" y hereda todo del admin.css 
*/
</style>
