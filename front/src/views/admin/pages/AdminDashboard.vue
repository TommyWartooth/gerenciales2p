<template>
  <div class="dashboard">

    <div class="dashboard__cards">
      <div class="dash-card" v-for="card in cards" :key="card.label">
        <span class="dash-card__icon">{{ card.icon }}</span>
        <div>
          <p class="dash-card__value">{{ card.value }}</p>
          <p class="dash-card__label">{{ card.label }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard__bottom">
      <div class="dash-section">
        <h3 class="dash-section__title">Pedidos recientes</h3>
        <table class="dash-table">
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
            <tr v-for="p in pedidosRecientes" :key="p.id">
              <td>{{ p.id }}</td>
              <td>{{ p.cliente }}</td>
              <td>{{ p.tipo }}</td>
              <td>Bs. {{ p.total }}</td>
              <td><span class="badge" :class="p.estado">{{ p.estado }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="dash-section">
        <h3 class="dash-section__title">Platos más pedidos</h3>
        <ul class="dash-list">
          <li v-for="(plato, i) in platosTop" :key="i" class="dash-list__item">
            <span class="dash-list__rank">{{ i + 1 }}</span>
            <span class="dash-list__name">{{ plato.nombre }}</span>
            <span class="dash-list__count">{{ plato.pedidos }} pedidos</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const emit = defineEmits(['set-titulo'])
onMounted(() => emit('set-titulo', 'Dashboard'))

const cards = [
  { icon: '📋', value: '24',    label: 'Pedidos hoy' },
  { icon: '👥', value: '138',   label: 'Clientes registrados' },
  { icon: '🍽️', value: '32',   label: 'Platos en carta' },
  { icon: '💰', value: 'Bs. 3,840', label: 'Ingresos del día' },
]

const pedidosRecientes = [
  { id: 1, cliente: 'Ana Mamani',    tipo: 'Local',     total: '85.00',  estado: 'confirmado' },
  { id: 2, cliente: 'Carlos Quispe', tipo: 'Domicilio', total: '120.50', estado: 'pendiente' },
  { id: 3, cliente: 'Lucía Flores',  tipo: 'Local',     total: '65.00',  estado: 'confirmado' },
  { id: 4, cliente: 'Mario Condori', tipo: 'Domicilio', total: '200.00', estado: 'entregado' },
]

const platosTop = [
  { nombre: 'Pique Macho',       pedidos: 48 },
  { nombre: 'Sajta de Pollo',    pedidos: 35 },
  { nombre: 'Silpancho',         pedidos: 29 },
  { nombre: 'Fricasé Real',      pedidos: 22 },
  { nombre: 'Majadito de Charque', pedidos: 18 },
]
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 2rem; }

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
.badge.confirmado { background: rgba(68,2,14,0.4); color: var(--gold); border: 1px solid rgba(235,205,149,0.2); }
.badge.pendiente  { background: rgba(180,120,0,0.2); color: #e8c96a; border: 1px solid rgba(220,180,0,0.2); }
.badge.entregado  { background: rgba(30,80,40,0.3); color: #7ed4a0; border: 1px solid rgba(50,150,80,0.2); }

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
  width: 22px;
  height: 22px;
  background: var(--wine);
  color: var(--gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
}

.dash-list__name { flex: 1; color: var(--white); }
.dash-list__count { color: var(--gold-dim); font-size: 0.75rem; }

@media (max-width: 768px) {
  .dashboard__bottom { grid-template-columns: 1fr; }
}
</style>