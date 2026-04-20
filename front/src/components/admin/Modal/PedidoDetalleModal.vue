<template>
  <!-- Overlay -->
  <div class="overlay" @click.self="cerrar">
    <div class="modal">
      <header class="modal-header">
        <div>
          <h3>Detalle del pedido #{{ pedido.id }}</h3>
          <p class="sub">
            Cliente: <strong>{{ pedido.cliente }}</strong>
          </p>
        </div>
        <button class="btn-cerrar" @click="cerrar">✕</button>
      </header>

      <section class="modal-body">
        <!-- INFO GENERAL -->
        <div class="bloque">
          <h4>Información general</h4>
          <div class="grid-2">
            <div>
              <span class="label">Fecha y hora</span>
              <p>{{ pedido.fecha || "—" }}</p>
            </div>
            <div>
              <span class="label">Estado</span>
              <p>{{ pedido.estado || "Confirmado" }}</p>
            </div>
            <div>
              <span class="label">Tipo de entrega</span>
              <p>{{ pedido.tipo_entrega }}</p>
            </div>
            <div>
              <span class="label">Total</span>
              <p>
                <strong>S/ {{ (pedido.total || 0).toFixed(2) }}</strong>
              </p>
            </div>
          </div>
        </div>

        <!-- ENTREGA (si aplica) -->
        <div class="bloque" v-if="pedido.tipo_entrega === 'Domicilio'">
          <h4>Datos de entrega</h4>
          <div class="grid-2">
            <div>
              <span class="label">Dirección</span>
              <p>{{ pedido.direccion || "—" }}</p>
            </div>
            <div>
              <span class="label">Referencia</span>
              <p>{{ pedido.referencia || "—" }}</p>
            </div>
            <div>
              <span class="label">Teléfono</span>
              <p>{{ pedido.telefono || "—" }}</p>
            </div>
            <div>
              <span class="label">Documento / NIT</span>
              <p>
                {{ pedido.tipo_doc || "—" }}
                <span v-if="pedido.nit"> - {{ pedido.nit }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- RESUMEN DE ÍTEMS -->
        <div class="bloque">
          <h4>Resumen de ítems</h4>
          <ul class="lista-resumen">
            <li v-if="pedido.cant_bebidas">
              Bebidas: <strong>{{ pedido.cant_bebidas }}</strong>
            </li>
            <li v-if="pedido.cant_entradas">
              Entradas: <strong>{{ pedido.cant_entradas }}</strong>
            </li>
            <li v-if="pedido.cant_platos">
              Platos fuertes: <strong>{{ pedido.cant_platos }}</strong>
            </li>
            <li v-if="pedido.cant_postres">
              Postres: <strong>{{ pedido.cant_postres }}</strong>
            </li>
            <li v-if="!tieneResumen">
              <em>Sin detalle de cantidades registrado.</em>
            </li>
          </ul>
        </div>
        <!-- LISTA DETALLADA DE PLATOS / ÍTEMS -->
        <div class="bloque" v-if="items.length">
          <h4>Detalle del pedido</h4>
          <table class="tabla-items">
            <thead>
              <tr>
                <th>#</th>
                <th>Tipo</th>
                <th>Producto</th>
                <th>Cant.</th>
                <th>Precio unit. (S/.)</th>
                <th>Subtotal (S/.)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in items" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td>{{ item.tipo }}</td>
                <td>{{ item.nombre }}</td>
                <td>{{ item.cantidad }}</td>
                <td>{{ item.precio_unitario.toFixed(2) }}</td>
                <td>{{ (item.cantidad * item.precio_unitario).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer class="modal-footer">
        <!-- Aquí en el futuro: botón Cambiar estado, Imprimir, etc -->
        <button class="btn-cerrar-primario" @click="cerrar">Cerrar</button>
      </footer>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  pedido: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["cerrar"]);

function cerrar() {
  emit("cerrar");
}

const tieneResumen = computed(() => {
  return (
    (props.pedido.cant_bebidas || 0) +
      (props.pedido.cant_entradas || 0) +
      (props.pedido.cant_platos || 0) +
      (props.pedido.cant_postres || 0) >
    0
  );
});

// 👇 por si no siempre viene items
const items = computed(() => props.pedido.items || []);
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 40;
}

.modal {
  background: #fffaf0;
  width: min(680px, 96vw);
  max-height: 90vh;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 12px 18px;
  background: #f3e1c4;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #3b2f22;
}

.sub {
  margin: 2px 0 0;
  font-size: 0.85rem;
  color: #6d5e4a;
}

.btn-cerrar {
  border: none;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
}

.modal-body {
  padding: 14px 18px;
  overflow-y: auto;
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.bloque {
  padding: 10px 12px;
  background: #fffdf7;
  border-radius: 10px;
  border: 1px solid #e2d2b7;
}

.bloque h4 {
  margin: 0 0 8px;
  font-size: 0.95rem;
  color: #3b2f22;
}

.label {
  display: block;
  font-size: 0.75rem;
  color: #8a7a63;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px 16px;
}

.lista-resumen {
  margin: 0;
  padding-left: 18px;
  font-size: 0.9rem;
  color: #3b2f22;
}

.modal-footer {
  padding: 10px 18px;
  border-top: 1px solid #e2d2b7;
  display: flex;
  justify-content: flex-end;
}

.btn-cerrar-primario {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #b9985b;
  background: #f7e3b4;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-cerrar-primario:hover {
  background: #f2d793;
}
</style>
