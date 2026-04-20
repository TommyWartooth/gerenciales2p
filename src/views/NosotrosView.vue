<template>
  <SideCabeceraTemporal />
  <SideAboutTemporal />
  <SideLineaTiempo />
</template>

<script setup>
import { onMounted, onBeforeUnmount, nextTick } from "vue";

import SideAboutTemporal from "@/components/sobreNosotros/SideAboutTemporal.vue";
import SideCabeceraTemporal from "@/components/sobreNosotros/SideCabeceraTemporal.vue";
import SideLineaTiempo from "@/components/sobreNosotros/SideLineaTiempo.vue";

let io; // IntersectionObserver

onMounted(async () => {
  // Espera a que los hijos rendericen su HTML (las .timeline-item)
  await nextTick();

  const items = document.querySelectorAll(".timeline-item");

  // Mostrar de entrada lo que ya esté a la vista
  const initialReveal = () => {
    items.forEach((el) => {
      const r = el.getBoundingClientRect();
      const inView = r.top < window.innerHeight * 0.85;
      if (inView) el.classList.add("visible");
    });
  };

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => io.observe(el));
  initialReveal();
});

onBeforeUnmount(() => {
  if (io) io.disconnect();
});
</script>
