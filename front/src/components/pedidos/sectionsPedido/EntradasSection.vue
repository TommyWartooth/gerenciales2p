<template>
  <section class="pedido-menu">
    <h3 class="section-title">Entradas</h3>
    <p class="section-help">Elige una entrada para comenzar tu experiencia.</p>

    <div class="entradas-lista">
      <article v-for="item in entradas" :key="item.id" class="entrada-card">
        <div class="entrada-img-wrap">
          <img :src="item.imagen" :alt="item.nombre" class="entrada-img" />
        </div>

        <div class="entrada-info">
          <h4 class="entrada-nombre">{{ item.nombre }}</h4>
          <p class="entrada-desc">{{ item.descripcion }}</p>
          <div class="entrada-footer">
            <span class="entrada-precio">{{ item.costo_unitario }} bs</span>
            <button class="btn-ordenar" @click="seleccionar(item)">
              Ordenar
            </button>
          </div>
        </div>
      </article>

      <p v-if="!entradas.length" class="mensaje-vacio">
        No hay entradas disponibles por ahora.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const emit = defineEmits(["seleccionar-item"]);

const entradas = ref([]);
const loading = ref(true);
const error = ref(null);

async function cargarPlatos() {
  try {
    const resp = await fetch("http://localhost:3000/api/platos/categoria/2");
    if (!resp.ok) throw new Error("Error HTTP");

    entradas.value = await resp.json();
    console.log("[EntradasSection] entradas:", entradas.value);
  } catch (err) {
    console.error("Error cargando platos:", err);
    error.value = err;
  } finally {
    loading.value = false;
  }
}

function seleccionar(item) {
  console.log("=== [SECTION] ITEM SELECCIONADO ===");
  console.log("id:", item.id, typeof item.id);
  console.log("nombre:", item.nombre);
  console.log("precio bruto:", item.precio || item.costo_unitario);
  console.log("categoria:", item.idcategoria);

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
.entradas-lista {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

/* Card compacta horizontal */
.entrada-card {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.55rem 0.7rem;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.25);
}

/* Mini imagen */
.entrada-img-wrap {
  width: 85px;
  height: 85px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.entrada-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Info al lado */
.entrada-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.entrada-nombre {
  font-size: 0.9rem;
  font-weight: 600;
  color: #facc15;
}

.entrada-desc {
  font-size: 0.8rem;
  opacity: 0.7;
  line-height: 1.2;
}

/* Precio y botón */
.entrada-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.entrada-precio {
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
