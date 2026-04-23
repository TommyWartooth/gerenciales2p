<template>
  <div class="tabla-wrap">
    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Entrega (Modalidad)</th>
          <th>Estado</th>
          <th>Comentarios</th>
          <th>Total</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in pedidos" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.cliente }}</td>
          <td>{{ p.modalidad }}</td> <td>
            <span class="badge">{{ p.estado }}</span>
          </td>
          <td>{{ p.comentarios || 'Sin comentarios' }}</td>
          <td style="color: var(--gold); font-weight: bold;">
            Bs. {{ p.total?.toFixed(2) }}
          </td>
          <td class="acciones">
            <button class="btn-edit" @click="$emit('ver', p)">
              Ver Detalles
            </button>
          </td>
        </tr>
        
        <tr v-if="!pedidos || !pedidos.length">
          <td colspan="7" class="tabla-vacia">
            No hay pedidos registrados en este momento.
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
.badge {
  background-color: #eee;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: bold;
  color: #333;
}
</style>