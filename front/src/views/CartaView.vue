<template>
  <section class="carta">
    <SideCabecera />

    <SideBebidas :items="bebidasUI" />
    <SideEntradas :items="entradasUI" />
    <SidePlatos :items="platosUI" />
    <SidePostres :items="postresUI" />
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

import SideBebidas from "@/components/carta/SideBebidas.vue";
import SideCabecera from "@/components/carta/SideCabecera.vue";
import SideEntradas from "@/components/carta/SideEntradas.vue";
import SidePlatos from "@/components/carta/SidePlatos.vue";
import SidePostres from "@/components/carta/SidePostres.vue";

const bebidas = ref([]);
const entradas = ref([]);
const platos = ref([]);
const postres = ref([]);

function esDisponible(p) {
  return p.disponibilidad === true || p.disponibilidad === 1;
}

function mapUI(p) {
  const disponible = esDisponible(p);
  return {
    ...p,
    disponible,
    noDisponible: !disponible,
    tooltipText: `${p.nombre} — ${disponible ? "Disponible" : "No disponible"}`,
  };
}

const bebidasUI = computed(() => bebidas.value.map(mapUI));
const entradasUI = computed(() => entradas.value.map(mapUI));
const platosUI = computed(() => platos.value.map(mapUI));
const postresUI = computed(() => postres.value.map(mapUI));

onMounted(async () => {
  try {
    const res = await fetch("/api/platos");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    bebidas.value = data.filter((p) => p.idcategoria === 1);
    entradas.value = data.filter((p) => p.idcategoria === 2);
    platos.value = data.filter((p) => p.idcategoria === 3);
    postres.value = data.filter((p) => p.idcategoria === 4);
  } catch (error) {
    console.error("Error cargando desde back", error);
  }
});
</script>
