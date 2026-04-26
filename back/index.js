import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";

// --- IMPORTACIONES DE RUTAS ---
import pedidoRouter from "./routes/pedido.routes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"; // ¡Aquí traes tus rutas de usuarios!
import platoRoutes from "./routes/platoRoutes.js";
import { pool } from "./db/pool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Configuración de CORS (La versión pro que subieron)
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitimos cualquier origen local para evitar bloqueos
      callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ==========================================
// --- TUS ENDPOINTS (RUTAS BASE) ---
// ==========================================

// ¡Y aquí es donde las conectas! Todo lo de usuarios vivirá en /api/usuarios/...
app.use('/api/usuarios', usuarioRoutes); 
app.use('/api/platos', platoRoutes);
app.use("/api/pedidos", pedidoRouter);

// Endpoint de salud mejorado
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now(), message: 'olas' });
});

// Tu ruta base "ola unu"
app.get('/', (req, res) => {
    res.send('ola unu');
});

// ==========================================
// --- CONEXIÓN A BD Y ARRANQUE ---
// ==========================================

pool
  .connect()
  .then((client) => {
    console.log("Conectado a PostgreSQL correctamente uwu");
    client.release();
  })
  .catch((err) => {
    console.error("Error al conectar a PostgreSQL:", err.message);
  });

// Iniciar servidor
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Backend listening on http://127.0.0.1:${PORT}`);
});