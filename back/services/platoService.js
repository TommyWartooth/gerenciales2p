import { pool } from "../db/pool.js";
import { Plato } from "../domain/Plato.js";

export class PlatosService {
  async getAll() {
    const { rows } = await pool.query(
      "SELECT * FROM plato ORDER BY idplato DESC ",
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

  async getByCategory(idcategoria) {
    const query = `
    SELECT *
    FROM plato
    WHERE idcategoria = $1 
      AND disponibilidad = true  -- <--- FILTRO AGREGADO
    ORDER BY nombre;
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

    const query = `
    INSERT INTO plato (nombre, costo_unitario, descripcion, disponibilidad, imagen, idcategoria)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

    const values = [
      plato.nombre,
      plato.costo_unitario,
      plato.descripcion,
      plato.disponibilidad,
      plato.imagen,
      plato.idcategoria,
    ];

    const { rows } = await pool.query(query, values);
    return Plato.fromDbRow(rows[0]);
  }

  async delete(id) {
    const { rowCount } = await pool.query(
      "DELETE FROM plato where idplato = $1",
      [id],
    );

    return rowCount;
  }

  async update(id, data) {
    const query = `
    UPDATE plato 
    SET nombre = $1, 
        costo_unitario = $2, 
        descripcion = $3, 
        disponibilidad = $4, 
        imagen = $5,
        idcategoria = $6
    WHERE idplato = $7
    RETURNING *;
  `;

    const values = [
      data.nombre,
      data.costo_unitario,
      data.descripcion,
      data.disponibilidad,
      data.imagen,
      data.idcategoria,
      id,
    ];

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      throw new Error("Plato no encontrado");
    }

    return Plato.fromDbRow(rows[0]);
  }

  

async getAll() {
  const query = `
    SELECT 
      p.*, 
      (SELECT COUNT(*) FROM pedido_plato pp WHERE pp.idplato = p.idplato) = 0 AS puede_borrarse
    FROM plato p
    ORDER BY p.idplato DESC;
  `;

  const { rows } = await pool.query(query);

  return rows.map((row) => {
    const plato = Plato.fromDbRow(row);
    // Inyectamos la propiedad directamente al objeto mapeado
    plato.puede_borrarse = row.puede_borrarse;
    return plato;
  });
}
}
