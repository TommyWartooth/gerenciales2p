import { pool } from "../db/pool.js";
import { Plato } from "../domain/Plato.js";

export class PlatosService {
  async getAll() {
    const { rows } = await pool.query(
      `
      SELECT 
        p.*, 
        ph.costo_unitario, 
        (SELECT COUNT(*) FROM pedido_plato pp WHERE pp.idplato = p.idplato) = 0 AS puede_borrarse
      FROM plato p
      LEFT JOIN precio_historial ph ON p.idplato = ph.idplato AND ph.fecha_hasta IS NULL
      ORDER BY p.idplato DESC;
      `
    );
    return rows.map((row) => Plato.fromDbRow(row));
  }

  async getById(id) {
    const { rows } = await pool.query(
      "SELECT * FROM plato WHERE idplato = $1",
      [id],
    );

    if (rows.length === 0) return null;

    return Plato.fromDbRow(rows[0]);
  }

  // En PlatosService.js
async getByCategory(idcategoria) {
  const query = `
    SELECT DISTINCT ON (p.idplato) -- Esto evita duplicados de platos
      p.*, 
      ph.costo_unitario
    FROM plato p
    LEFT JOIN precio_historial ph ON p.idplato = ph.idplato
    WHERE p.idcategoria = $1 
      AND p.disponibilidad = true
    ORDER BY p.idplato, ph.fecha_desde DESC; -- Trae siempre el más nuevo primero
  `;

  const { rows } = await pool.query(query, [idcategoria]);
  return rows.map((row) => Plato.fromDbRow(row));
}

  async create(data) {
    const plato = new Plato({
      nombre: data.nombre,
      costo_unitario: data.costo_unitario,
      descripcion: data.descripcion,
      disponibilidad: data.disponibilidad,
      imagen: data.imagen,
      idcategoria: data.idcategoria,
    });

    plato.validar();

    // Necesitamos un cliente para la transacción
    const client = await pool.connect();
    
    try {
      await client.query("BEGIN");

      // 1. Insertamos solo los datos básicos en 'plato' (quitamos costo_unitario)
      const queryPlato = `
        INSERT INTO plato (nombre, descripcion, disponibilidad, imagen, idcategoria)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;

      const valuesPlato = [
        plato.nombre,
        plato.descripcion,
        plato.disponibilidad,
        plato.imagen,
        plato.idcategoria,
      ];

      const { rows } = await client.query(queryPlato, valuesPlato);
      const platoInsertado = rows[0];

      // 2. Insertamos el precio en la tabla de historial usando el ID que acabamos de obtener
      await client.query(
        "INSERT INTO precio_historial (idplato, costo_unitario) VALUES ($1, $2)",
        [platoInsertado.idplato, plato.costo_unitario]
      );

      await client.query("COMMIT");

      // Inyectamos el costo de vuelta al objeto para que el Front no reciba un null
      platoInsertado.costo_unitario = plato.costo_unitario;

      return Plato.fromDbRow(platoInsertado);

    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error al crear plato:", err);
      throw err;
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const { rowCount } = await pool.query(
      "DELETE FROM plato where idplato = $1",
      [id],
    );

    return rowCount;
  }

  async update(id, data) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // 1. Actualizamos los datos básicos en la tabla plato (sin costo_unitario)
      const { rows } = await client.query(
        `
        UPDATE plato 
        SET nombre = $1, 
            descripcion = $2, 
            disponibilidad = $3, 
            imagen = $4,
            idcategoria = $5
        WHERE idplato = $6
        RETURNING *;
        `,
        [data.nombre, data.descripcion, data.disponibilidad, data.imagen, data.idcategoria, id]
      );

      if (rows.length === 0) {
        await client.query("ROLLBACK");
        throw new Error("Plato no encontrado");
      }

      // 2. Insertamos el precio en el historial. 
      // El Trigger en PostgreSQL cerrará el anterior por nosotros.
      await client.query(
        "INSERT INTO precio_historial (idplato, costo_unitario) VALUES ($1, $2)",
        [id, data.costo_unitario]
      );

      await client.query("COMMIT");

      // Inyectamos el costo para que el objeto Plato salga completo
      const platoActualizado = rows[0];
      platoActualizado.costo_unitario = data.costo_unitario;

      return Plato.fromDbRow(platoActualizado);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  

async getAll() {
  const query = `
    SELECT 
      p.*, 
      ph.costo_unitario, -- Traemos el costo desde el historial
      (SELECT COUNT(*) FROM pedido_plato pp WHERE pp.idplato = p.idplato) = 0 AS puede_borrarse
    FROM plato p
    -- JOIN para obtener el precio que NO tiene fecha de fin (el actual)
    LEFT JOIN precio_historial ph ON p.idplato = ph.idplato AND ph.fecha_hasta IS NULL
    ORDER BY p.idplato DESC;
  `;

  const { rows } = await pool.query(query);

  return rows.map((row) => {
    // Plato.fromDbRow(row) ahora recibirá 'costo_unitario' desde la fila
    const plato = Plato.fromDbRow(row);
    plato.puede_borrarse = row.puede_borrarse;
    return plato;
  });
}
}
