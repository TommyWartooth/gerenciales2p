import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";

// --- IMPORTACIONES DE RUTAS (Tus rutas + las nuevas) ---
import pedidoRouter from "./routes/pedido.routes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js"; // Tus rutas
import platoRoutes from "./routes/platoRoutes.js";     // Tus rutas
import { pool } from "./db/pool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configuración de CORS (La versión pro que subieron)
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

// --- TUS RUTAS ---
app.use('/api/usuarios', usuarioRoutes); 
app.use('/api/platos', platoRoutes);
app.use("/api/pedidos", pedidoRouter); // La ruta que subió tu compa

// Endpoint de salud mejorado
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now(), message: 'olas' });
});

// Tu ruta base "ola unu"
app.get('/', (req, res) => {
    res.send('ola unu');
});

// Conexión a la BD
pool
  .connect()
  .then((client) => {
    console.log("Conectado a PostgreSQL correctamente");
    client.release();
  })
  .catch((err) => {
    console.error("Error al conectar a PostgreSQL:", err.message);
  });

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});