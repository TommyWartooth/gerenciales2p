<template>
  <section class="admin-view">
    <header class="admin-header">
      <h2>Gestión de Pedidos</h2>
    </header>

    <PedidosTabla 
      :pedidos="listaPedidos" 
      @ver="abrirDetallePedido" 
    />

    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-content">
        <header class="modal-header">
          <h3>Detalle del Pedido #{{ pedidoSeleccionado?.id }}</h3>
          <button class="btn-cerrar" @click="cerrarModal">✖</button>
        </header>

        <div class="modal-body" v-if="pedidoSeleccionado">
          
          <div class="detalle-seccion">
            <h4>Datos del Cliente</h4>
            <p><strong>Nombre:</strong> {{ pedidoSeleccionado.cliente }}</p>
            <p v-if="pedidoSeleccionado.correoCliente"><strong>Correo:</strong> {{ pedidoSeleccionado.correoCliente }}</p>
            <p><strong>Modalidad:</strong> {{ pedidoSeleccionado.modalidad }}</p>
            <p v-if="pedidoSeleccionado.direccion"><strong>Dirección:</strong> {{ pedidoSeleccionado.direccion }}</p>
            <p><strong>Estado Actual:</strong> {{ pedidoSeleccionado.estado }}</p>
          </div>

          <div class="detalle-seccion">
            <h4>Detalle de Platos</h4>
            <table class="tabla-detalles" style="width: 100%; text-align: left; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #eee;">
                  <th style="padding-bottom: 5px;">Cant.</th>
                  <th style="padding-bottom: 5px;">Plato</th>
                  <th style="padding-bottom: 5px;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in pedidoSeleccionado.items" :key="item.idplato" style="border-bottom: 1px solid #f5f5f5;">
                  <td style="padding: 8px 0;">{{ item.cantidad }}x</td>
                  <td style="padding: 8px 0;">{{ item.nombre }}</td>
                  <td style="padding: 8px 0;">Bs. {{ item.precio?.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="detalle-total">
            <h3>Total: Bs. {{ pedidoSeleccionado.total?.toFixed(2) }}</h3>
          </div>
          
        </div>
        
        <footer class="modal-footer" style="margin-top: 20px; text-align: right;">
          <button class="btn-primario" @click="cerrarModal" style="background-color: var(--gold, #d4af37); color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: bold;">
            Cerrar
          </button>
        </footer>

      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import PedidosTabla from '@/components/admin/Tabla/PedidosTabla.vue'; // Asegúrate de que la ruta sea correcta

// Estado
const listaPedidos = ref([]); 
const mostrarModal = ref(false);
const pedidoSeleccionado = ref(null);

// Cargar pedidos al iniciar
onMounted(async () => {
  await cargarPedidos();
});

async function cargarPedidos() {
  try {
    // Hacemos el fetch real a tu backend
    const res = await fetch('http://localhost:3000/api/pedidos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error(`Error en la petición: ${res.status}`);
    }

    // Convertimos la respuesta a JSON
    const data = await res.json();
    
    // Asignamos la data a nuestra variable reactiva
    listaPedidos.value = data;
    
    console.log("Pedidos cargados con éxito:", listaPedidos.value);

  } catch (error) {
    console.error("Error al cargar los pedidos:", error);
  }
}

// Función que se ejecuta cuando la tabla emite el evento "ver"
function abrirDetallePedido(pedido) {
  // Como tu backend ya agrupa los "items" (platos) en la consulta getAll(),
  // el objeto 'pedido' ya trae todo lo necesario. ¡No hace falta otro fetch!
  pedidoSeleccionado.value = pedido;
  mostrarModal.value = true;
}

function cerrarModal() {
  mostrarModal.value = false;
  pedidoSeleccionado.value = null;
}
</script>

<style scoped>
.admin-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: transparent;
  padding: 0;
}

.admin-section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.breadcrumbs {
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 4px;
}

.section-title {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-style: italic;
  color: #ebcd95; /* Gold */
}

.section-desc {
  margin: 4px 0 0 0;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  color: #888;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.search-input {
  background: #1a1a1a !important;
  border: 1px solid rgba(235,205,149,0.15) !important;
  border-radius: 3px;
  color: #fff !important;
  font-family: 'Jost', sans-serif;
  font-size: 0.85rem;
  padding: 0.55rem 1rem;
  outline: none;
  width: 260px;
}

.stats-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-card {
  min-width: 180px;
  background: #1a1a1a;
  padding: 1.2rem;
  border-radius: 4px;
  border: 1px solid rgba(235,205,149,0.1);
}

.stat-label {
  display: block;
  font-family: 'Jost', sans-serif;
  font-size: 0.72rem;
  color: #ebcd95;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}

.stat-value {
  font-family: 'Jost', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #fff;
}
</style>