import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; 
import { pool } from './db/pool.js';
import usuarioRoutes from './routes/usuarioRoutes.js'; 
import platoRoutes from './routes/platoRoutes.js';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(json());

app.use('/api/usuarios', usuarioRoutes); 
app.use('/api/platos', platoRoutes);


app.get('/', (req, res) => {
    res.send('ola unu');
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now(), message: 'olas' });
});

// Conexión a la BD
pool
  .connect()
  .then((client) => {
    console.log("conectado a PostgreSQL correctamente");
    client.release();
  })
  .catch((err) => {
    console.error("error al conectar a PostgreSQL:", err.message);
  });

app.listen(PORT, () => {
    console.log(`Corriendo en http://localhost:${PORT}`);
});