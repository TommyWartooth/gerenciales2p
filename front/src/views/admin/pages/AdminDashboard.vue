<template>
  <div class="dashboard">

    <div class="dashboard__header">
      <button 
        @click="generarPDF" 
        :disabled="cargando"
        class="btn-download"
      >
        <span class="icon">📥</span> Descargar Reporte PDF
      </button>
    </div>

    <div class="dashboard__cards">
      <div class="dash-card" v-for="card in cards" :key="card.label">
        <span class="dash-card__icon">{{ card.icon }}</span>
        <div>
          <p class="dash-card__value">{{ cargando ? '...' : card.value }}</p>
          <p class="dash-card__label">{{ card.label }}</p>
        </div>
      </div>
    </div>

    <div v-if="error" class="dash-error">
      ⚠️ {{ error }}
    </div>

    <div class="dashboard__bottom">
      <div class="dash-section">
        <h3 class="dash-section__title">Pedidos recientes</h3>
        <p v-if="cargando" class="dash-cargando">Cargando...</p>
        <table v-else class="dash-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pedidosRecientes" :key="p.nropedido ?? p.id">
              <td>{{ p.nropedido ?? p.id }}</td>
              <td>{{ p.nombre_cliente ?? p.cliente ?? '—' }}</td>
              <td>{{ p.modalidad ?? '—' }}</td>
              <td>Bs. {{ Number(p.total ?? 0).toFixed(2) }}</td>
              <td>
                <span class="badge" :class="(p.estado ?? '').toLowerCase()">
                  {{ p.estado ?? '—' }}
                </span>
              </td>
            </tr>
            <tr v-if="!pedidosRecientes.length">
              <td colspan="5" class="dash-vacia">No hay pedidos registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="dash-section">
        <h3 class="dash-section__title">Platos en carta</h3>
        <p v-if="cargando" class="dash-cargando">Cargando...</p>
        <ul v-else class="dash-list">
          <li v-for="(plato, i) in platosTop" :key="i" class="dash-list__item">
            <span class="dash-list__rank">{{ i + 1 }}</span>
            <span class="dash-list__name">{{ plato.nombre }}</span>
            <span class="dash-list__count">
              Bs. {{ Number(plato.costo_unitario ?? 0).toFixed(2) }}
            </span>
          </li>
          <li v-if="!platosTop.length" class="dash-vacia">Sin platos.</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
const emit = defineEmits(['set-titulo'])

const cargando  = ref(true)
const error     = ref(null)

const pedidos  = ref([])
const platos   = ref([])
const clientes = ref([])

const token = localStorage.getItem('token')
const headers = {
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
}

async function cargarDatos() {
  cargando.value = true
  error.value    = null
  try {
    const [resPedidos, resPlatos, resClientes] = await Promise.all([
      fetch('http://localhost:3000/api/pedidos',           { headers }),
      fetch('http://localhost:3000/api/platos',            { headers }),
      fetch('http://localhost:3000/api/usuarios/clientes', { headers }),
    ])

    if (resPedidos.ok)  pedidos.value  = await resPedidos.json()
    if (resPlatos.ok)   platos.value   = await resPlatos.json()
    if (resClientes.ok) clientes.value = await resClientes.json()

    // normalizar si vienen dentro de una propiedad
    if (!Array.isArray(pedidos.value))  pedidos.value  = pedidos.value?.pedidos  ?? pedidos.value?.data  ?? []
    if (!Array.isArray(platos.value))   platos.value   = platos.value?.platos    ?? platos.value?.data   ?? []
    if (!Array.isArray(clientes.value)) clientes.value = clientes.value?.clientes ?? clientes.value?.data ?? []

  } catch (err) {
    console.error('Error dashboard:', err)
    error.value = 'No se pudieron cargar los datos. ¿Está el backend corriendo?'
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  emit('set-titulo', 'Dashboard')
  cargarDatos()
})

// ── Stats calculadas ──────────────────────────────────
const totalPedidos  = computed(() => pedidos.value.length)
const totalClientes = computed(() => clientes.value.length)
const totalPlatos   = computed(() => platos.value.length)
const ingresoTotal  = computed(() => {
  const suma = pedidos.value.reduce((acc, p) => acc + Number(p.total ?? 0), 0)
  return `Bs. ${suma.toFixed(2)}`
})

const cards = computed(() => [
  { icon: '📋', value: totalPedidos.value,  label: 'Pedidos totales' },
  { icon: '👥', value: totalClientes.value, label: 'Clientes registrados' },
  { icon: '🍽️', value: totalPlatos.value,  label: 'Platos en carta' },
  { icon: '💰', value: ingresoTotal.value,  label: 'Ingresos totales' },
])

// Últimos 5 pedidos
const pedidosRecientes = computed(() =>
  [...pedidos.value]
    .sort((a, b) => (b.nropedido ?? b.id ?? 0) - (a.nropedido ?? a.id ?? 0))
    .slice(0, 5)
)

// Primeros 5 platos disponibles
const platosTop = computed(() =>
  platos.value.filter(p => p.disponibilidad !== false).slice(0, 5)
)
const generarPDF = () => {
  const doc = new jsPDF()
  const fecha = new Date().toLocaleDateString()
  const hora = new Date().toLocaleTimeString()

  // Título
  doc.setFontSize(18)
  doc.setTextColor(20, 20, 20)
  doc.text('Reporte General del Sistema - Restaurant', 14, 20)
  
  // Subtítulo / Fecha
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el: ${fecha} a las ${hora}`, 14, 28)
  doc.line(14, 32, 196, 32) // Línea divisoria

  // Sección 1: Resumen de KPIs
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text('Resumen de Gestión', 14, 45)
  
  const resumenData = cards.value.map(c => [c.label, c.value])
  
  // PRIMER CAMBIO AQUÍ
  autoTable(doc, {
    startY: 50,
    head: [['Indicador', 'Valor']],
    body: resumenData,
    theme: 'striped',
    headStyles: { fillColor: [68, 2, 14] }, 
    styles: { fontSize: 10 }
  })

  // Sección 2: Pedidos
  const finalY = doc.lastAutoTable.finalY
  
  doc.setFontSize(14)
  doc.text('Últimos Pedidos', 14, finalY + 15)

  const tablaPedidos = pedidosRecientes.value.map(p => [
    p.nropedido ?? p.id,
    p.nombre_cliente ?? p.cliente ?? '—',
    p.modalidad ?? '—',
    `Bs. ${Number(p.total ?? 0).toFixed(2)}`,
    p.estado ?? '—'
  ])

  // SEGUNDO CAMBIO AQUÍ
  autoTable(doc, {
    startY: finalY + 20,
    head: [['#', 'Cliente', 'Tipo', 'Total', 'Estado']],
    body: tablaPedidos,
    headStyles: { fillColor: [180, 120, 0] },
    styles: { fontSize: 10 }
  })

  // Descargar el archivo
  doc.save(`Reporte_Dashboard_${fecha.replace(/\//g, '-')}.pdf`)
} 
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 2rem; }

/* -- Estilos del botón de PDF -- */
.dashboard__header {
  display: flex;
  justify-content: flex-end;
}

.btn-download {
  background: var(--wine, #44020e);
  color: var(--gold, #e8c96a);
  border: 1px solid rgba(235, 205, 149, 0.3);
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Cormorant Garamond', serif;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-download:hover {
  background: rgba(68, 2, 14, 0.8);
  border-color: var(--gold);
}

.btn-download:disabled {
  background: rgba(255, 255, 255, 0.1);
  color: #888;
  border-color: transparent;
  cursor: not-allowed;
}
/* ------------------------------ */

.dashboard__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.dash-card {
  background: var(--black-soft);
  border: 1px solid rgba(235,205,149,0.12);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: border-color 0.2s;
}
.dash-card:hover { border-color: rgba(235,205,149,0.3); }

.dash-card__icon { font-size: 2rem; }

.dash-card__value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--gold);
  line-height: 1;
}

.dash-card__label {
  font-size: 0.75rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 0.2rem;
}

.dashboard__bottom {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.dash-section {
  background: var(--black-soft);
  border: 1px solid rgba(235,205,149,0.1);
  padding: 1.5rem;
}

.dash-section__title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-style: italic;
  color: var(--gold);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(235,205,149,0.1);
}

.dash-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.dash-table th, .dash-table td {
  padding: 0.6rem 0.8rem;
  text-align: left;
  border-bottom: 1px solid rgba(235,205,149,0.07);
  color: var(--muted);
}

.dash-table th {
  color: var(--gold-dim);
  font-weight: 600;
  letter-spacing: 0.05em;
  font-size: 0.72rem;
  text-transform: uppercase;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: capitalize;
}
.badge.confirmado { background: rgba(68,2,14,0.4);   color: var(--gold);  border: 1px solid rgba(235,205,149,0.2); }
.badge.pendiente  { background: rgba(180,120,0,0.2); color: #e8c96a;      border: 1px solid rgba(220,180,0,0.2); }
.badge.entregado  { background: rgba(30,80,40,0.3);  color: #7ed4a0;      border: 1px solid rgba(50,150,80,0.2); }

.dash-list { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }

.dash-list__item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(235,205,149,0.06);
  font-size: 0.83rem;
}

.dash-list__rank {
  width: 22px; height: 22px;
  background: var(--wine);
  color: var(--gold);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 700;
  flex-shrink: 0;
}

.dash-list__name  { flex: 1; color: var(--white); }
.dash-list__count { color: var(--gold-dim); font-size: 0.75rem; }

.dash-cargando { color: var(--muted); font-style: italic; font-size: 0.85rem; }
.dash-vacia    { color: var(--muted); font-style: italic; font-size: 0.82rem; padding: 1rem 0; }

.dash-error {
  background: rgba(120,20,20,0.2);
  border: 1px solid rgba(180,40,40,0.3);
  color: #f4a0a0;
  padding: 0.8rem 1.2rem;
  font-size: 0.85rem;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .dashboard__bottom { grid-template-columns: 1fr; }
}
</style>