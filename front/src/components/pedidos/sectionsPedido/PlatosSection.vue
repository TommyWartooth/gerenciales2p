<template>
  <section class="pedido-menu">
    <h3 class="section-title">Platos</h3>
    <p class="section-help">Elige uno de nuestros platos principales.</p>

    <div class="platos-lista">
      <article v-for="item in platos" :key="item.id" class="plato-card">
        <div class="plato-img-wrap">
          <img :src="item.imagen" :alt="item.nombre" class="plato-img" />
        </div>

        <div class="plato-info">
          <h4 class="plato-nombre">{{ item.nombre }}</h4>
          <p class="plato-desc">{{ item.descripcion }}</p>
          <div class="plato-footer">
            <span class="plato-precio">{{ item.costo_unitario }} bs</span>
            <button class="btn-ordenar" @click="seleccionar(item)">
              Ordenar
            </button>
          </div>
        </div>
      </article>

      <p v-if="!platos.length" class="mensaje-vacio">
        No hay platos disponibles por ahora.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["seleccionar-item"]);

const platos = ref([]);
const loading = ref(true);
const error = ref(null);

async function cargarPlatos() {
  try {
    const resp = await fetch("http://localhost:3000/api/platos/categoria/3");
    if (!resp.ok) throw new Error("Error HTTP");

    platos.value = await resp.json();
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
.platos-lista {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* Card compacta horizontal */
.plato-card {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.55rem 0.7rem;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

/* Mini imagen */
.plato-img-wrap {
  width: 85px;
  height: 85px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.plato-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Info al lado */
.plato-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.plato-nombre {
  font-size: 0.9rem;
  font-weight: 600;
  color: #facc15;
}

.plato-desc {
  font-size: 0.8rem;
  opacity: 0.7;
  line-height: 1.2;
}

/* Precio y botón */
.plato-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plato-precio {
  font-weight: 700;
  color: #bbf7d0;
}

/* Botón reutilizado */
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
