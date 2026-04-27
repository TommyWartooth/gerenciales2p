<template>
  <div id="app">
    <header v-if="!esVistaPanel">
      <Navbar />
      <Topbar />
    </header>

    <main>
      <router-view />
    </main>

    <footer v-if="!esVistaPanel">
      <PedidoPanel
        :carrito="carrito"
        @confirmar-bebida="agregarAlCarrito"
        @eliminar-item="eliminarDelCarrito"
        @guardar-datos="manejarGuardarDatos"
      />
      <FooterSeccion />
    </footer>

    <div v-if="pedidoExitoso" class="modal-exito-overlay">
      <div class="modal-exito-content">
        <div class="icono-exito">✅</div>
        <h2 class="titulo-exito">¡Pedido Exitoso!</h2>
        <p class="texto-exito">Tu orden ha sido recibida y ya estamos trabajando en ella.</p>
        
        <div class="nro-caja">
          <span class="nro-label">Nro de Pedido</span>
          <span class="nro-valor">#{{ nroPedidoGenerado }}</span>
        </div>

        <button class="btn-aceptar" @click="cerrarModalExito">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// Importamos el store de autenticación (para obtener el documento del cliente)
import { useAuthStore } from './stores/auth'

import Navbar from './components/layout/Navbar.vue'
import Topbar from './components/layout/Topbar.vue'
import FooterSeccion from './components/layout/FooterSeccion.vue'
import PedidoPanel from './components/pedidos/PedidoPanel.vue'

const route = useRoute()
const auth = useAuthStore() // <--- Instanciamos auth

const esVistaPanel = computed(() => {
  const path = route.path || ''
  return path.startsWith('/admin') || path.startsWith('/recepcionista')
})

// === Gestión del Carrito ===
const carrito = ref([])

const agregarAlCarrito = (nuevoItem) => {
  const itemExistente = carrito.value.find(item => 
    item.id === nuevoItem.id && item.comentario === nuevoItem.comentario
  );

  if (itemExistente) {
    itemExistente.cantidad += nuevoItem.cantidad;
    itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
  } else {
    carrito.value.push(nuevoItem);
  }
}

const eliminarDelCarrito = (id) => {
  const index = carrito.value.findIndex(item => item.id === id);
  if (index !== -1) {
    carrito.value.splice(index, 1);
  }
}

// === Lógica de Éxito y Envío al Backend ===
const pedidoExitoso = ref(false)
const nroPedidoGenerado = ref(null)

const manejarGuardarDatos = async (datos) => {
  try {
    // 1. 🛠️ ADAPTAR LOS DATOS PARA QUE EL BACKEND LOS ENTIENDA
    const payload = {
      // Mapeamos el 'carrito' a lo que espera Pedido_Plato (idplato y cantidad)
      platos: carrito.value.map(item => ({
        idplato: item.id,
        cantidad: item.cantidad
      })),
      
      // Asignamos modalidad (Ej: 2 para delivery, 1 para sucursal. Cámbialo si tu BD es distinta)
      idmodalidad: datos.tipoPedido === 'domicilio' ? 2 : 1,
      
      // Estado inicial del pedido (Ej: 1 = Pendiente)
      idestadop: 1,
      
      // Armamos la dirección
      direccion: datos.tipoPedido === 'domicilio' 
        ? `${datos.direccion.direccion}, ${datos.direccion.zona}` 
        : 'Retiro en local',
        
      // ⚠️ MUY IMPORTANTE: La BD requiere el documento del usuario logueado
      documento: auth.usuario?.documento || datos.contacto?.documento,
      
      // Comentarios extra
      comentarios: datos.direccion?.descripcionExtra || ""
    };

    console.log("Enviando este payload al backend:", payload);

    // 2. HACEMOS LA PETICIÓN
    const response = await fetch("http://localhost:3000/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // 3. CAPTURAMOS EL ERROR EXACTO SI ALGO SALE MAL
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Detalle del error del backend:", errorData);
      throw new Error(errorData.message || "Error interno en la Base de Datos");
    }

    const resultado = await response.json();

    // 4. SI TODO SALE BIEN, MOSTRAMOS EL MODAL
    nroPedidoGenerado.value = resultado.nropedido || resultado.id;
    pedidoExitoso.value = true;
    carrito.value = [];

  } catch (error) {
    console.error('Error al procesar el pedido:', error);
    // Ahora el alert te dirá exactamente QUÉ falló (Ej: "documento inválido" o "idplato no existe")
    alert(`No se pudo completar el pedido: ${error.message}`);
  }
}

const cerrarModalExito = () => {
  pedidoExitoso.value = false;
  nroPedidoGenerado.value = null;
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;700&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --wine:       #44020e;
  --wine-dark:  #2e0109;
  --wine-light: #6a0318;
  --gold:       #ebcd95;
  --gold-dim:   #c9a96e;
  --black:      #110f0d;
  --black-soft: #1c1917;
  --white:      #faf6f0;
  --muted:      #9e8e7e;
}

html { scroll-behavior: smooth; }

body {
  font-family: 'Jost', sans-serif;
  background-color: var(--black);
  color: var(--white);
  overflow-x: hidden;
}

h1, h2, h3, h4 {
  font-family: 'Cormorant Garamond', serif;
}

#app { 
  width: 100%; 
  min-height: 100vh; 
  display: flex;
  flex-direction: column;
}

main { 
  flex: 1;
  width: 100%; 
}

/* =========================================
   ESTILOS DE LA VENTANA EMERGENTE DE ÉXITO 
   ========================================= */
.modal-exito-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 15, 13, 0.9); /* Fondo oscuro transparente */
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999; /* Por encima de todo */
  padding: 1rem;
}

.modal-exito-content {
  background: var(--black-soft);
  border: 1px solid var(--gold-dim);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8);
}

.icono-exito {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
}

.titulo-exito {
  color: var(--gold);
  font-size: 2rem;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.texto-exito {
  font-size: 0.95rem;
  color: var(--white);
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.nro-caja {
  background: var(--wine-dark);
  border: 1px dashed var(--gold-dim);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.nro-label {
  display: block;
  font-size: 0.8rem;
  color: var(--gold-dim);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.3rem;
}

.nro-valor {
  display: block;
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--gold);
}

.btn-aceptar {
  background: var(--wine);
  color: var(--gold);
  border: 1px solid var(--gold-dim);
  padding: 0.8rem 2.5rem;
  font-family: 'Jost', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-aceptar:hover {
  background: var(--wine-light);
  color: var(--white);
  border-color: var(--gold);
}
</style>