<template>
  <section class="pedido-menu">
    <h3 class="section-title">Bebidas</h3>
    <p class="section-help">Elige una bebida para acompañar tu pedido.</p>

    <div class="bebidas-lista">
      <article v-for="item in bebidas" :key="item.id" class="bebida-card">
        <div class="bebida-img-wrap">
          <img :src="item.imagen" :alt="item.nombre" class="bebida-img" />
        </div>

        <div class="bebida-info">
          <h4 class="bebida-nombre">{{ item.nombre }}</h4>
          <p class="bebida-desc">{{ item.descripcion }}</p>
          <div class="bebida-footer">
            <span class="bebida-precio">{{ item.costo_unitario }} bs</span>
            <button class="btn-ordenar" @click="seleccionar(item)">
              Ordenar
            </button>
          </div>
        </div>
      </article>

      <p v-if="!bebidas.length" class="mensaje-vacio">
        No hay bebidas disponibles por ahora.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["seleccionar-item"]);

const bebidas = ref([]);
const loading = ref(true);
const error = ref(null);

async function cargarPlatos() {
  try {
    const resp = await fetch("http://localhost:3000/api/platos/categoria/1");
    if (!resp.ok) throw new Error("Error HTTP");

    bebidas.value = await resp.json();
  } catch (err) {
    console.error("Error cargando platos:", err);
    error.value = err;
  } finally {
    loading.value = false;
  }
}

function seleccionar(item) {
  emit("seleccionar-item", item);
}

onMounted(cargarPlatos);
</script>
<style scoped>
/* Contenedor general del menú */
.pedido-menu {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Lista */
.bebidas-lista {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* Card compacta horizontal */
.bebida-card {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.55rem 0.7rem;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

/* Mini imagen */
.bebida-img-wrap {
  width: 85px;
  height: 85px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.bebida-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Info al lado */
.bebida-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bebida-nombre {
  font-size: 0.9rem;
  font-weight: 600;
  color: #facc15;
}

.bebida-desc {
  font-size: 0.8rem;
  opacity: 0.7;
  line-height: 1.2;
}

/* Precio y botón */
.bebida-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bebida-precio {
  font-weight: 700;
  color: #bbf7d0;
}

.btn-ordenar {
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  border: none;
  background: #eab308;
  color: #0f172a;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>