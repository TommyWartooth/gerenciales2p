// src/server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";

import pedidoRouter from "./routes/pedido.routes.js";
import { pool } from "./db/pool.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Ajusta según tu frontend
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use("/api/pedidos", pedidoRouter);

// Endpoint de salud (opcional, para verificar que el servidor funciona)
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

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
