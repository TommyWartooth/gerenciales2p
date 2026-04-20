<template>
  <div class="overlay admin-theme" @click.self="cerrar">
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
        <div class="bloque">
          <h4>Información general</h4>
          <div class="grid-2">
            <div>
              <span class="label">Fecha y hora</span>
              <p class="val">{{ pedido.fecha || "—" }}</p>
            </div>
            <div>
              <span class="label">Estado</span>
              <p class="val">{{ pedido.estado || "Confirmado" }}</p>
            </div>
            <div>
              <span class="label">Tipo de entrega</span>
              <p class="val">{{ pedido.tipo_entrega }}</p>
            </div>
            <div>
              <span class="label">Total</span>
              <p class="val total-oro">
                BS. {{ (pedido.total || 0).toFixed(2) }}
              </p>
            </div>
          </div>
        </div>

        <div class="bloque" v-if="pedido.tipo_entrega === 'Domicilio'">
          <h4>Datos de entrega</h4>
          <div class="grid-2">
            <div>
              <span class="label">Dirección</span>
              <p class="val">{{ pedido.direccion || "—" }}</p>
            </div>
            <div>
              <span class="label">Teléfono</span>
              <p class="val">{{ pedido.telefono || "—" }}</p>
            </div>
          </div>
        </div>

        <div class="bloque" v-if="items.length">
          <h4>Detalle de productos</h4>
          <div class="tabla-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in items" :key="idx">
                  <td>{{ item.nombre }}</td>
                  <td>{{ item.cantidad }}</td>
                  <td style="color: var(--gold)">Bs. {{ (item.cantidad * item.precio_unitario).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer class="modal-footer">
        <button class="btn-delete" @click="cerrar">Cerrar Detalle</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({ pedido: { type: Object, required: true } });
const emit = defineEmits(["cerrar"]);
const cerrar = () => emit("cerrar");
const items = computed(() => props.pedido.items || []);
</script>

<style scoped>
/* Reset de estilos para Modo Oscuro Ejecutivo */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: var(--black-soft);
  width: min(700px, 96vw);
  max-height: 85vh;
  border-radius: 4px; /* Menos redondeado = más serio */
  border: 1px solid var(--wine);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  background: var(--black);
  border-bottom: 1px solid rgba(235, 205, 149, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.4rem;
  color: var(--gold);
}

.sub {
  font-size: 0.8rem;
  color: var(--muted);
  margin-top: 4px;
}

.btn-cerrar {
  color: var(--gold-dim);
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bloque {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(235, 205, 149, 0.05);
  border-radius: 4px;
}

.bloque h4 {
  margin: 0 0 12px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gold-dim);
  border-bottom: 1px solid rgba(106, 3, 24, 0.3);
  padding-bottom: 4px;
}

.label {
  font-size: 0.7rem;
  color: var(--muted);
  text-transform: uppercase;
}

.val {
  color: var(--white);
  font-size: 0.95rem;
  margin: 2px 0 10px;
}

.total-oro {
  color: var(--gold) !important;
  font-weight: 700;
  font-size: 1.2rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.modal-footer {
  padding: 1.2rem 1.5rem;
  background: var(--black);
  border-top: 1px solid rgba(235, 205, 149, 0.1);
  display: flex;
  justify-content: flex-end;
}

/* Scrollbar personalizada para que no rompa la estética */
.modal-body::-webkit-scrollbar { width: 6px; }
.modal-body::-webkit-scrollbar-thumb { background: var(--wine); border-radius: 10px; }
</style>
