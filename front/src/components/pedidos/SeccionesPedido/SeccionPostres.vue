<template>
  <section class="pedido-menu">
    <h3 class="section-title">Postres</h3>
    <p class="section-help">Termina tu comida con un postre.</p>

    <div class="postres-lista">
      <article v-for="item in postres" :key="item.id" class="postre-card">
        <div class="postre-img-wrap">
          <img :src="item.imagen" :alt="item.nombre" class="postre-img" />
        </div>

        <div class="postre-info">
          <h4 class="postre-nombre">{{ item.nombre }}</h4>
          <p class="postre-desc">{{ item.descripcion }}</p>
          <div class="postre-footer">
            <span class="postre-precio">{{ item.costo_unitario }} bs</span>
            <button class="btn-ordenar" @click="seleccionar(item)">
              Ordenar
            </button>
          </div>
        </div>
      </article>

      <p v-if="!postres.length" class="mensaje-vacio">
        No hay postres disponibles por ahora.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["seleccionar-item"]);

const postres = ref([]);
const loading = ref(true);
const error = ref(null);

async function cargarPlatos() {
  try {
    const resp = await fetch("http://localhost:3000/api/platos/categoria/4");
    if (!resp.ok) throw new Error("Error HTTP");

    postres.value = await resp.json();
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

/* Lista */
.postres-lista {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* Card compacta horizontal */
.postre-card {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.55rem 0.7rem;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

/* Mini imagen */
.postre-img-wrap {
  width: 85px;
  height: 85px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.postre-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Info */
.postre-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.postre-nombre {
  font-size: 0.9rem;
  font-weight: 600;
  color: #facc15;
}

.postre-desc {
  font-size: 0.8rem;
  opacity: 0.7;
  line-height: 1.2;
}

/* Footer */
.postre-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.postre-precio {
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