<template>
  <section class="reservas-container">
    <!-- HEADER SUPERIOR -->
    <header class="reservas-header">
      <div>
        <h1 class="reservas-title">Reservas de mesas</h1>
        <p class="reservas-sub">Gestiona las reservas del día</p>
      </div>

      <div class="reservas-header-right">
        <label class="fecha-label">
          Fecha:
          <input type="date" v-model="fechaSeleccionada" />
        </label>

        <button class="btn-nueva" type="button">+ Nueva reserva</button>
      </div>
    </header>

    <!-- CUERPO PRINCIPAL -->
    <div class="reservas-layout">
      <!-- IZQUIERDA: lista de reservas -->
      <section class="reservas-lista">
        <div v-if="!reservasVisibles.length" class="mensaje-vacio">
          No hay reservas activas para esta fecha.
        </div>

        <article
          v-for="reserva in reservasVisibles"
          :key="reserva.idReserva"
          class="reserva-card"
          @click="seleccionarReserva(reserva)"
        >
          <div class="reserva-card-header">
            <h3>Reserva #{{ reserva.idReserva }}</h3>
            <span class="reserva-hora">
              {{ reserva.hora_inicio }} – {{ reserva.hora_fin }}
            </span>
          </div>

          <p class="reserva-linea">
            <strong>Mesas:</strong> {{ reserva.mesas.join(", ") }}
          </p>
          <p class="reserva-linea">
            <strong>Cliente:</strong> {{ reserva.cliente }}
          </p>
          <p class="reserva-linea">
            <strong>Personas:</strong> {{ reserva.cant_personas }}
          </p>
          <p class="reserva-linea">
            <strong>Estado:</strong> {{ reserva.estado }}
          </p>
        </article>
      </section>

      <!-- DERECHA: croquis + detalle -->
      <section class="reservas-detalle">
        <!-- Croquis -->
        <div class="croquis-wrapper">
          <div class="croquis-mapa">
            <img
              src="/imagenes/mesas.png"
              alt="Croquis de mesas"
              class="croquis-img"
            />

            <!-- puntos de mesas -->
            <button
              v-for="mesa in mesas"
              :key="mesa.idMesa"
              class="mesa-dot"
              :class="`mesa-dot--${mesa.estadoVisual}`"
              :style="{ top: mesa.posY + '%', left: mesa.posX + '%' }"
              @click="seleccionarMesa(mesa)"
            >
              {{ mesa.idMesa }}
            </button>
          </div>

          <div class="croquis-leyenda">
            <span class="leyenda leyenda--libre">Libre</span>
            <span class="leyenda leyenda--reservada">Reservada</span>
            <span class="leyenda leyenda--ocupada">Ocupada</span>
          </div>
        </div>

        <!-- Detalle de mesa / reserva -->
        <div v-if="mesaSeleccionada" class="detalle-mesa">
          <h3>Mesa {{ mesaSeleccionada.idMesa }}</h3>
          <p>Capacidad: {{ mesaSeleccionada.capacidad }} personas</p>

          <template v-if="reservaSeleccionada">
            <p><strong>Cliente:</strong> {{ reservaSeleccionada.cliente }}</p>
            <p>
              <strong>Hora:</strong>
              {{ reservaSeleccionada.hora_inicio }} –
              {{ reservaSeleccionada.hora_fin }}
            </p>
            <p>
              <strong>Personas:</strong> {{ reservaSeleccionada.cant_personas }}
            </p>

            <div class="campo">
              <label>Estado de reserva:</label>

              <!-- COMBO BOX DE ESTADOS (viene del array de BD simulado) -->
              <select v-model="reservaSeleccionada.estado">
                <option
                  v-for="estado in estadosReserva"
                  :key="estado"
                  :value="estado"
                >
                  {{ estado }}
                </option>
              </select>
            </div>

            <button
              class="btn-guardar"
              type="button"
              @click="guardarCambiosReserva"
            >
              Guardar cambios
            </button>
          </template>

          <template v-else>
            <p>No hay reserva para esta mesa en la fecha seleccionada.</p>
          </template>
        </div>

        <div v-else class="detalle-placeholder">
          <p>
            Selecciona una <strong>reserva</strong> o una
            <strong>mesa en el croquis</strong> para ver los detalles aquí.
          </p>
        </div>
      </section>
    </div>
  </section>
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue";

// --------------------------
// ESTADOS (para combo)
// --------------------------
const estadosReserva = [
  "Pendiente",
  "Confirmada",
  "En uso",
  "Finalizada",
  "Cancelada",
];

// map texto -> idestadoh
const idPorEstado = {
  Pendiente: 1,
  Confirmada: 2,
  "En uso": 3,
  "En Uso": 3,
  Finalizada: 4,
  Cancelada: 5,
};

// map id -> texto (por si backend no manda nombre)
const estadoPorId = {
  1: "Pendiente",
  2: "Confirmada",
  3: "En uso",
  4: "Finalizada",
  5: "Cancelada",
};

// --------------------------
// FECHA Y HORA
// --------------------------
const fechaSeleccionada = ref(new Date().toISOString().slice(0, 10));
const horaSeleccionada = ref("18:00");

// --------------------------
// MESAS (mock solo visual)
// --------------------------
const mesas = ref([
  { idMesa: 1, capacidad: 4, posX: 12, posY: 75, estadoVisual: "libre" },
  { idMesa: 2, capacidad: 4, posX: 28, posY: 50, estadoVisual: "libre" },
  { idMesa: 3, capacidad: 2, posX: 50, posY: 32, estadoVisual: "libre" },
  { idMesa: 4, capacidad: 6, posX: 72, posY: 50, estadoVisual: "libre" },
  { idMesa: 5, capacidad: 6, posX: 87, posY: 75, estadoVisual: "libre" },
]);

// --------------------------
// RESERVAS (desde BD)
// --------------------------
const reservas = ref([]);
const cargandoReservas = ref(false);
const errorReservas = ref(null);

async function cargarReservas() {
  cargandoReservas.value = true;
  errorReservas.value = null;

  try {
    const resp = await fetch("/api/reservas");
    if (!resp.ok) throw new Error("Error al cargar reservas");

    const data = await resp.json();
    console.log("RESERVAS API:", data);

    reservas.value = data.map((r) => {
      const fechaStr =
        typeof r.fecha === "string" ? r.fecha.slice(0, 10) : null;

      return {
        idReserva: r.idreserva,
        fecha: fechaStr,
        cant_personas: r.cant_personas,
        hora_inicio: r.hora_inicio ? r.hora_inicio.slice(0, 5) : null,
        hora_fin: r.hora_fin ? r.hora_fin.slice(0, 5) : null,
        idestadoh: r.idestadoh,
        estado: r.estado || estadoPorId[r.idestadoh] || "Pendiente",
        cliente: r.cliente ?? "Cliente",
        mesas: Array.isArray(r.mesas) ? r.mesas : [r.idmesa],
      };
    });

    console.log("RESERVAS MAPEADAS:", reservas.value);
  } catch (err) {
    console.error("Error al cargar reservas:", err);
    errorReservas.value = err.message;
  } finally {
    cargandoReservas.value = false;
  }
}

// --------------------------
// RESERVAS VISIBLES
// --------------------------
const reservasVisibles = computed(() => {
  // 👀 para probar que lee, puedes descomentar esta línea:
  // return reservas.value;

  return reservas.value.filter((r) => {
    const mismaFecha = r.fecha === fechaSeleccionada.value;
    const activaPorId = r.idestadoh && [1, 2, 3].includes(r.idestadoh);
    const activaPorTexto = [
      "Pendiente",
      "Confirmada",
      "En uso",
      "En Uso",
    ].includes(r.estado);
    return mismaFecha && (activaPorId || activaPorTexto);
  });
});

const mesaSeleccionada = ref(null);
const reservaSeleccionada = ref(null);

// --------------------------
// HORA -> MINUTOS
// --------------------------
function convertirAHoras(hora) {
  if (!hora) return null;
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

// --------------------------
// ESTADO VISUAL MESAS
// --------------------------
function actualizarEstadoMesas() {
  mesas.value.forEach((m) => (m.estadoVisual = "libre"));

  const horaSel = convertirAHoras(horaSeleccionada.value);
  if (horaSel == null) return;

  reservasVisibles.value.forEach((res) => {
    const desde = convertirAHoras(res.hora_inicio);
    const hasta = convertirAHoras(res.hora_fin || res.hora_inicio);
    if (desde == null || hasta == null) return;

    const estaDentro = horaSel >= desde && horaSel <= hasta;
    if (!estaDentro) return;

    res.mesas.forEach((idMesa) => {
      const mesa = mesas.value.find((m) => m.idMesa === idMesa);
      if (!mesa) return;

      if (res.estado === "En uso" || res.estado === "En Uso") {
        mesa.estadoVisual = "ocupada";
      } else {
        mesa.estadoVisual = "reservada";
      }
    });
  });
}

// --------------------------
// SELECCIÓN
// --------------------------
function seleccionarReserva(reserva) {
  reservaSeleccionada.value = { ...reserva };
  mesaSeleccionada.value = mesas.value.find((m) =>
    reserva.mesas.includes(m.idMesa)
  );
}

function seleccionarMesa(mesa) {
  mesaSeleccionada.value = mesa;
  const res = reservasVisibles.value.find((r) => r.mesas.includes(mesa.idMesa));
  reservaSeleccionada.value = res ? { ...res } : null;
}

// --------------------------
// GUARDAR ESTADO
// --------------------------
async function guardarCambiosReserva() {
  if (!reservaSeleccionada.value) return;

  const id = reservaSeleccionada.value.idReserva;
  const nuevoIdEstado =
    idPorEstado[reservaSeleccionada.value.estado] ??
    reservaSeleccionada.value.idestadoh ??
    1;

  try {
    const resp = await fetch(`/api/reservas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idestadoh: nuevoIdEstado,
        cant_personas: reservaSeleccionada.value.cant_personas,
        fecha: reservaSeleccionada.value.fecha,
        hora_inicio: reservaSeleccionada.value.hora_inicio,
        hora_fin: reservaSeleccionada.value.hora_fin,
        idmesa: reservaSeleccionada.value.mesas?.[0],
      }),
    });

    if (!resp.ok) throw new Error("Error al actualizar reserva");

    const actualizada = await resp.json();

    const idx = reservas.value.findIndex((r) => r.idReserva === id);
    if (idx !== -1) {
      reservas.value[idx] = {
        ...reservas.value[idx],
        idestadoh: actualizada.idestadoh ?? nuevoIdEstado,
        estado:
          actualizada.estado ||
          estadoPorId[actualizada.idestadoh] ||
          reservas.value[idx].estado,
      };
    }

    const estadoFinal = reservas.value[idx]?.estado;
    if (estadoFinal === "Confirmada") {
      enviarCorreoConfirmacion(reservaSeleccionada.value);
    }

    actualizarEstadoMesas();
  } catch (err) {
    console.error("Error al actualizar reserva:", err);
    alert("No se pudo guardar el cambio de estado");
  }
}

function enviarCorreoConfirmacion(reserva) {
  console.log("Correo listo para enviar:", reserva);
}

watch([fechaSeleccionada, horaSeleccionada], actualizarEstadoMesas);

onMounted(async () => {
  await cargarReservas();
  actualizarEstadoMesas();
});
</script>

<style scoped>
/* Contenedor general (usa el fondo del layout recepcionista) */
.reservas-container {
  padding: 0.75rem 0.5rem 1.5rem;
  color: #0f172a;
}

/* HEADER */
.reservas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.9rem;
}

.reservas-title {
  margin: 0;
  font-size: 1.6rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #facc15;
}

.reservas-sub {
  margin: 0.2rem 0 0;
  font-size: 0.9rem;
  color: #e5e7eb;
}

.reservas-header-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.fecha-label {
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #e5e7eb;
}

.fecha-label input {
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.9);
  background: rgba(15, 23, 42, 0.9);
  color: #f9fafb;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
}

.btn-nueva {
  border-radius: 999px;
  border: none;
  padding: 0.35rem 0.9rem;
  background: #facc15;
  color: #0b1720;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

/* LAYOUT PRINCIPAL */
.reservas-layout {
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(280px, 2.3fr);
  gap: 1.2rem;
}

/* IZQUIERDA: lista */
.reservas-lista {
  overflow-y: auto;
  padding-right: 0.5rem;
  max-height: calc(100vh - 170px);
  scrollbar-width: none;
}

.reservas-lista::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.reserva-card {
  background: rgba(6, 47, 52, 0.95);
  border-radius: 14px;
  border: 1px solid rgba(15, 23, 42, 0.9);
  padding: 0.8rem 0.9rem;
  margin-bottom: 0.6rem;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.08s ease;
  color: #f9fafb;
}

.reserva-card:hover {
  background: rgba(5, 35, 40, 0.98);
  transform: translateY(-1px);
}

.reserva-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reserva-card-header h3 {
  margin: 0;
  font-size: 0.95rem;
  color: #facc15;
}

.reserva-hora {
  font-size: 0.8rem;
  opacity: 0.85;
}

.reserva-linea {
  margin: 0.15rem 0;
  font-size: 0.8rem;
}

.reserva-botones {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.45rem;
}

.btn-llegada,
.btn-cancelar {
  flex: 1;
  border-radius: 999px;
  border: none;
  padding: 0.3rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  font-weight: 600;
}

.btn-llegada {
  background: #22c55e;
  color: #022c22;
}

.btn-cancelar {
  background: #b91c1c;
  color: #fee2e2;
}

.mensaje-vacio {
  font-size: 0.85rem;
  opacity: 0.9;
  color: #e5e7eb;
}

/* DERECHA: croquis + detalle */
.reservas-detalle {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

/* Croquis */
.croquis-wrapper {
  background: #062f33;
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.9);
  padding: 0.55rem;
}

.croquis-mapa {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.croquis-img {
  width: 100%;
  display: block;
}

/* puntos de mesa */
.mesa-dot {
  position: absolute;
  transform: translate(-50%, 40%);
  width: 26px;
  height: 26px;
  border-radius: 999px;
  border: 2px solid #020617;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  color: #0b1720;
}

.mesa-dot--libre {
  background: #22c55e;
}

.mesa-dot--reservada {
  background: #facc15;
}

.mesa-dot--ocupada {
  background: #dc2626;
  color: #fee2e2;
}

.croquis-leyenda {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.45rem;
  font-size: 0.75rem;
  color: #e5e7eb;
}

.leyenda {
  border-radius: 999px;
  padding: 0.15rem 0.5rem;
}

.leyenda--libre {
  background: #22c55e33;
}

.leyenda--reservada {
  background: #facc1533;
}

.leyenda--ocupada {
  background: #dc262633;
}

/* Detalle mesa / reserva */
.detalle-mesa {
  background: rgba(6, 32, 38, 0.98);
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.9);
  padding: 0.7rem 0.9rem;
  font-size: 0.85rem;
  color: #f9fafb;
}

.detalle-mesa h3 {
  margin: 0 0 0.25rem;
  color: #facc15;
}

.campo {
  display: flex;
  flex-direction: column;
  margin-top: 0.4rem;
}

.campo label {
  margin-bottom: 0.15rem;
  font-weight: 600;
}

.campo select {
  border-radius: 8px;
  border: 1px solid rgba(148, 163, 184, 0.8);
  background: #020617;
  color: #f9fafb;
  padding: 0.25rem 0.45rem;
}

.btn-guardar,
.btn-nueva-mesa {
  margin-top: 0.6rem;
  width: 100%;
  border-radius: 999px;
  border: none;
  padding: 0.4rem 0;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-guardar {
  background: #facc15;
  color: #0b1720;
}

.btn-nueva-mesa {
  background: #22c55e;
  color: #022c22;
}

.detalle-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0.9;
  background: rgba(6, 32, 38, 0.7);
  border-radius: 12px;
  border: 1px dashed rgba(148, 163, 184, 0.7);
  padding: 0.9rem;
  color: #e5e7eb;
}

@media (max-width: 900px) {
  .reservas-layout {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
