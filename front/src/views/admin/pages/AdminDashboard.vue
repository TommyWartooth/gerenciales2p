<template>
  <section class="admin-main" ref="dashboardRef">
    <!-- HEADER -->
    <header class="admin-header">
      <div class="admin-title-left">
        <h1 class="admin-title">Dashboard</h1>

        <p class="admin-subtitle">Resumen del mes actual</p>
      </div>

      <div class="admin-title-right">
        <button class="admin-export-btn" @click="exportarPDF">
          Exportar PDF
        </button>
      </div>
    </header>

    <!-- KPIs PRINCIPALES -->
    <section class="admin-section">
      <header class="admin-section-header">
        <h2 class="admin-section-title">Resumen mensual</h2>
      </header>

      <div class="admin-grid admin-grid--kpis">
        <!-- Ganancias totales -->
        <article class="admin-card admin-kpi">
          <h3 class="admin-kpi-label">Ganancias totales del mes</h3>
          <p class="admin-kpi-value">
            {{ resumenMensual.gananciasTotales }}
          </p>
          <p class="admin-kpi-hint">Incluye solo pedidos completados</p>
        </article>

        <!-- Pedidos totales -->
        <article class="admin-card admin-kpi">
          <h3 class="admin-kpi-label">Pedidos totales del mes</h3>
          <p class="admin-kpi-value">
            {{ resumenMensual.pedidosTotales }}
          </p>
          <p class="admin-kpi-hint">Todos los pedidos registrados</p>
        </article>

        <!-- Clientes nuevos -->
        <article class="admin-card admin-kpi">
          <h3 class="admin-kpi-label">Clientes nuevos</h3>
          <p class="admin-kpi-value">
            {{ resumenMensual.clientesNuevos }}
          </p>
          <p class="admin-kpi-hint">Clientes registrados este mes</p>
        </article>
      </div>
    </section>

    <!-- PEDIDOS POR TIPO / ESTADO -->
    <section class="admin-section">
      <div class="admin-grid admin-grid--2">
        <!-- Pedidos por tipo -->
        <article class="admin-card">
          <header class="admin-section-header admin-section-header--inner">
            <h2 class="admin-section-title">Pedidos por tipo</h2>
          </header>

          <table class="admin-table">
            <thead>
              <tr>
                <th>Tipo de pedido</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tipo in pedidosPorTipo" :key="tipo.tipo">
                <td>{{ tipo.tipo }}</td>
                <td>{{ tipo.cantidad }}</td>
              </tr>
              <tr v-if="!pedidosPorTipo.length">
                <td colspan="2" class="admin-table-empty">Sin datos</td>
              </tr>
            </tbody>
          </table>
        </article>

        <!-- Pedidos por estado -->
        <article class="admin-card">
          <header class="admin-section-header admin-section-header--inner">
            <h2 class="admin-section-title">Pedidos por estado</h2>
          </header>

          <table class="admin-table">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="estado in pedidosPorEstado" :key="estado.estado">
                <td>{{ estado.estado }}</td>
                <td>{{ estado.cantidad }}</td>
              </tr>
              <tr v-if="!pedidosPorEstado.length">
                <td colspan="2" class="admin-table-empty">
                  Sin datos de estados todavía
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </section>

    <!-- TOP PLATOS / PLATOS NO VENDIDOS -->
    <section class="admin-section">
      <div class="admin-grid admin-grid--2">
        <!-- Top 5 platos más vendidos -->
        <article class="admin-card">
          <header class="admin-section-header admin-section-header--inner">
            <h2 class="admin-section-title">Top 5 platos más vendidos</h2>
          </header>

          <table class="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Plato</th>
                <th>Cantidad vendida</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(plato, index) in topPlatos"
                :key="plato.idplato ?? index"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ plato.nombre }}</td>
                <td>{{ plato.cantidadVendida }}</td>
              </tr>
              <tr v-if="!topPlatos.length">
                <td colspan="3" class="admin-table-empty">
                  Aún no hay datos para el top de platos
                </td>
              </tr>
            </tbody>
          </table>
        </article>

        <!-- Platos que no se vendieron -->
        <article class="admin-card">
          <header class="admin-section-header admin-section-header--inner">
            <h2 class="admin-section-title">Platos sin ventas en el mes</h2>
          </header>

          <table class="admin-table">
            <thead>
              <tr>
                <th>Plato</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="plato in platosNoVendidos"
                :key="plato.idplato ?? plato.nombre"
              >
                <td>{{ plato.nombre }}</td>
                <td>{{ plato.categoria || "—" }}</td>
              </tr>
              <tr v-if="!platosNoVendidos.length">
                <td colspan="2" class="admin-table-empty">
                  Todos los platos tuvieron al menos una venta este mes 🎉
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const dashboardRef = ref(null);

const resumenMensual = ref({
  gananciasTotales: "S/ 0.00",
  pedidosTotales: 0,
  clientesNuevos: 0,
});

const pedidosPorTipo = ref([]);
const pedidosPorEstado = ref([]);
const topPlatos = ref([]);
const platosNoVendidos = ref([]);

const cargando = ref(true);
const error = ref(null);

// ======================= EXPORTAR PDF =======================
const exportarPDF = async () => {
  await nextTick();

  const element = dashboardRef.value;
  if (!element) return;

  // Por si el usuario está scrolleando, evita cortes raros:
  const prevScrollY = window.scrollY;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    scrollY: -window.scrollY,
  });

  window.scrollTo(0, prevScrollY);

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`dashboard-${new Date().toISOString().slice(0, 10)}.pdf`);
};

// ======================= CARGAR DATOS =======================
async function cargarDashboard() {
  cargando.value = true;
  error.value = null;

  try {
    const resp = await fetch("http://localhost:3000/api/admin/dashboard");
    if (!resp.ok) throw new Error("Error al obtener el dashboard");

    const data = await resp.json();

    if (data.resumenMensual) {
      const g = Number(data.resumenMensual.gananciasTotales ?? 0);

      resumenMensual.value = {
        gananciasTotales: `S/ ${g.toFixed(2)}`,
        pedidosTotales: data.resumenMensual.pedidosTotales ?? 0,
        clientesNuevos: data.resumenMensual.clientesNuevos ?? 0,
      };
    }

    pedidosPorTipo.value = data.pedidosPorTipo ?? [];
    pedidosPorEstado.value = data.pedidosPorEstado ?? [];

    topPlatos.value = (data.topPlatos ?? []).map((p) => ({
      idplato: p.idplato,
      nombre: p.nombre,
      cantidadVendida: Number(p.cantidadvendida ?? p.cantidadVendida ?? 0),
    }));

    platosNoVendidos.value = data.platosNoVendidos ?? [];
  } catch (err) {
    console.error("❌ Error al cargar dashboard:", err);
    error.value = err.message;
  } finally {
    cargando.value = false;
  }
}

onMounted(() => {
  cargarDashboard();
});
</script>

<style scoped>
.admin-main {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: #ffffff; /* para que en PDF no salga transparente */
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.25rem;
}

.admin-title {
  font-size: 1.6rem;
  font-weight: 600;
}

.admin-subtitle {
  font-size: 0.9rem;
  color: #666;
}

.admin-section {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-section-header--inner {
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.admin-section-title {
  font-size: 1rem;
  font-weight: 600;
}

/* GRID LAYOUTS */
.admin-grid {
  display: grid;
  gap: 1rem;
}

.admin-grid--kpis {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.admin-grid--2 {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* CARDS / KPIs */
.admin-card {
  background: #fafafa;
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
}

.admin-kpi {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.admin-kpi-label {
  font-size: 0.9rem;
  color: #555;
}

.admin-kpi-value {
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 0.25rem;
}

.admin-kpi-hint {
  font-size: 0.8rem;
  color: #888;
}

/* TABLAS */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.admin-table th,
.admin-table td {
  padding: 0.5rem 0.4rem;
  text-align: left;
  border-bottom: 1px solid #f1f1f1;
}

.admin-table th {
  font-weight: 600;
  font-size: 0.85rem;
  color: #555;
}

.admin-table tbody tr:hover {
  background-color: #f9fafb;
}

.admin-table-empty {
  text-align: center;
  font-size: 0.85rem;
  color: #888;
  padding: 0.75rem 0;
}

.admin-export-btn {
  background: #c0402c;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: 0.2s;
}

.admin-export-btn:hover {
  background: #1e40af;
}
</style>
