<template>
  <section class="vista-pedidos">
    <!-- DEBUG: ver el carrito crudo -->
    <pre class="debug-carrito">
      {{ carrito }}
    </pre>
  </section>
</template>
<script setup>
import { ref, computed } from "vue";

// 🛒 Estado del carrito
const carrito = ref([]);

// 🧾 Total del carrito
const totalCarrito = computed(() =>
  carrito.value.reduce((acc, item) => acc + (item.subtotal || 0), 0)
);
</script>

<style scoped>
.vista-pedidos {
  min-height: 100vh;
}
.debug-carrito {
  background: #111;
  color: #0f0;
  padding: 1rem;
  font-size: 0.8rem;
  white-space: pre-wrap;
}
</style>