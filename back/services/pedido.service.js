// services/pedido.service.js
import { pool } from "../db/pool.js";
import { Pedido } from "../domain/Pedido.js";

export class PedidoService {
  async getAll() {
    const { rows } = await pool.query(
      `
      SELECT
        p.nropedido,
        p.comentarios,
        p.fecha_hora_pedido,
        p.idmodalidad,
        m.nombre AS modalidad,
        p.idestadop,
        ep.nombre AS estado,
        p.direccion,
        p.documento,

        u.nombre AS cliente,
        u.correo AS correo_cliente,
        uc.nit,
        uc.razon_social,

        pp.idplato,
        pl.nombre AS nombre_plato,
        pp.cantidad,
        pl.costo_unitario
      FROM pedido p
      JOIN pedido_plato pp ON pp.nropedido = p.nropedido
      JOIN plato pl ON pl.idplato = pp.idplato
      JOIN usuario u ON u.documento = p.documento
      LEFT JOIN usuario_cliente uc ON uc.documento = u.documento
      JOIN estadop ep ON ep.idestadop = p.idestadop
      JOIN modalidad m ON m.idmodalidad = p.idmodalidad
      WHERE p.idestadop IN (1, 2, 3)
      ORDER BY p.fecha_hora_pedido DESC, p.nropedido, pl.nombre;
      `,
    );

    const mapa = new Map();

    for (const row of rows) {
      if (!mapa.has(row.nropedido)) {
        mapa.set(row.nropedido, {
          id: row.nropedido,
          idestadop: row.idestadop,
          estado: row.estado,
          estadoPropuestoId: row.idestadop,
          cliente: row.cliente,
          total: 0,
          modalidad: row.modalidad,
          nit: row.nit,
          razonSocial: row.razon_social,
          comentarios: row.comentarios,
          correoCliente: row.correo_cliente,
          direccion: row.direccion,
          items: [],
        });
      }

      const pedido = mapa.get(row.nropedido);
      const subtotal =
        Number(row.costo_unitario ?? 0) * Number(row.cantidad ?? 0);

      pedido.total += subtotal;

      pedido.items.push({
        idplato: row.idplato,
        nombre: row.nombre_plato,
        cantidad: row.cantidad,
        detalle: "",
        precio: subtotal,
      });
    }

    return Array.from(mapa.values());
  }

  /**
   * Obtener un pedido por ID
   */
  async getById(nropedido) {
    const client = await pool.connect();
    try {
      const { rows: pedidosRows } = await client.query(
        "SELECT * FROM pedido WHERE nropedido = $1",
        [nropedido],
      );
      if (pedidosRows.length === 0) return null;

      const { rows: platosRows } = await client.query(
        `
        SELECT pp.idplato, pp.cantidad, p.nombre, p.costo_unitario
        FROM pedido_plato pp
        JOIN plato p ON p.idplato = pp.idplato
        WHERE pp.nropedido = $1
        `,
        [nropedido],
      );

      const platos = platosRows.map((r) => ({
        idplato: r.idplato,
        cantidad: r.cantidad,
        nombre: r.nombre,
        costo_unitario: Number(r.costo_unitario),
      }));

      return Pedido.fromDbRow(pedidosRows[0], platos);
    } finally {
      client.release();
    }
  }

  /**
   * CREAR pedido
   */
  async create(data) {
    const pedido = new Pedido({
      ...data,
      fecha_hora_pedido: data.fecha_hora_pedido ?? new Date(),
    });

    pedido.validarCrear();

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const insertPedidoQuery = `
        INSERT INTO pedido (comentarios, fecha_hora_pedido, idmodalidad, idestadop, direccion, documento)
        VALUES ($1, NOW(), $2, $3, $4, $5)
        RETURNING *;
      `;

      const pedidoValues = [
        pedido.comentarios,
        pedido.idmodalidad,
        pedido.idestadop,
        pedido.direccion,
        pedido.documento,
      ];

      const { rows: pedidoRows } = await client.query(
        insertPedidoQuery,
        pedidoValues,
      );

      const nropedido = pedidoRows[0].nropedido;

      const insertDetalleQuery = `
        INSERT INTO pedido_plato (nropedido, idplato, cantidad)
        VALUES ($1, $2, $3)
      `;

      for (const item of pedido.platos) {
        await client.query(insertDetalleQuery, [
          nropedido,
          item.idplato,
          item.cantidad,
        ]);
      }

      await client.query("COMMIT");
      return await this.getById(nropedido);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * ACTUALIZAR pedido completo
   */
  async updateCompleto(nropedido, data) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const updateCabeceraQuery = `
        UPDATE pedido
        SET comentarios = $1,
            fecha_hora_pedido = COALESCE($2, fecha_hora_pedido),
            idmodalidad = $3,
            idestadop = $4,
            direccion = $5,
            documento = $6
        WHERE nropedido = $7
        RETURNING *;
      `;

      const cabeceraValues = [
        data.comentarios ?? null,
        data.fecha_hora_pedido ?? null,
        data.idmodalidad,
        data.idestadop,
        data.direccion ?? null,
        data.documento,
        nropedido,
      ];

      const { rows: cabeceraRows } = await client.query(
        updateCabeceraQuery,
        cabeceraValues,
      );

      if (cabeceraRows.length === 0) {
        await client.query("ROLLBACK");
        return null;
      }

      await client.query("DELETE FROM pedido_plato WHERE nropedido = $1", [
        nropedido,
      ]);

      const insertDetalleQuery = `
        INSERT INTO pedido_plato (nropedido, idplato, cantidad)
        VALUES ($1, $2, $3)
      `;

      const nuevosPlatos = data.platos ?? [];

      for (const item of nuevosPlatos) {
        await client.query(insertDetalleQuery, [
          nropedido,
          item.idplato,
          item.cantidad,
        ]);
      }

      await client.query("COMMIT");
      return await this.getById(nropedido);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async delete(nropedido) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query("DELETE FROM pedido_plato WHERE nropedido = $1", [
        nropedido,
      ]);

      const { rowCount } = await client.query(
        "DELETE FROM pedido WHERE nropedido = $1",
        [nropedido],
      );

      await client.query("COMMIT");
      return rowCount > 0;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async actualizarEstado(nropedido, idestadop) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { rows: pedidoRows } = await client.query(
        `
      UPDATE pedido p
      SET idestadop = $2
      FROM estadop ep
      WHERE p.nropedido = $1
        AND ep.idestadop = $2
      RETURNING
        p.nropedido,
        p.documento,
        p.idestadop,
        ep.nombre AS estado;
      `,
        [nropedido, idestadop],
      );

      if (pedidoRows.length === 0) {
        await client.query("ROLLBACK");
        return null;
      }

      const pedidoRow = pedidoRows[0];

      // Buscar datos del cliente
      const { rows: clienteRows } = await client.query(
        `
      SELECT u.correo, u.nombre, u.apellidos
      FROM usuario u
      JOIN usuario_cliente uc ON uc.documento = u.documento
      WHERE u.documento = $1
      `,
        [pedidoRow.documento],
      );

      let correoCliente = null;
      let nombreCliente = null;

      if (clienteRows.length > 0) {
        correoCliente = clienteRows[0].correo;
        nombreCliente = `${clienteRows[0].nombre} ${
          clienteRows[0].apellidos || ""
        }`.trim();
      }

      await client.query("COMMIT");

      return {
        nropedido: pedidoRow.nropedido,
        idestadop: pedidoRow.idestadop,
        estado: pedidoRow.estado, // <- importante
        correoCliente,
        nombreCliente,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Error en actualizarEstado:", err);
      throw err;
    } finally {
      client.release();
    }
  }
async getHistorial() {
    const { rows } = await pool.query(
      `
    SELECT
      p.nropedido                  AS id,
      COALESCE(u.nombre, 'Sin registrar') AS cliente,
      uc.nit,
      uc.razon_social,
      m.nombre                     AS modalidad,
      ep.nombre                    AS estado,
      TO_CHAR(p.fecha_hora_pedido, 'YYYY-MM-DD') AS fecha,
      TO_CHAR(p.fecha_hora_pedido, 'HH24:MI')    AS hora,
      COALESCE(SUM(pp.cantidad * pl.costo_unitario), 0) AS total,
      p.comentarios
    FROM pedido p
    LEFT JOIN usuario u              ON u.documento = p.documento
    LEFT JOIN usuario_cliente uc     ON uc.documento = p.documento
    LEFT JOIN modalidad m            ON m.idmodalidad = p.idmodalidad
    LEFT JOIN estadop ep             ON ep.idestadop = p.idestadop
    LEFT JOIN pedido_plato pp        ON pp.nropedido = p.nropedido
    LEFT JOIN plato pl               ON pl.idplato = pp.idplato
    -- Aquí la magia: Buscamos por la palabra, no por el ID, así no falla
    WHERE ep.nombre ILIKE 'entregado' OR ep.nombre ILIKE 'cancelado' 
       OR p.idestadop IN (4, 5)
    GROUP BY 
      p.nropedido, u.nombre, uc.nit, uc.razon_social,
      m.nombre, ep.nombre, fecha, hora, p.comentarios
    ORDER BY p.fecha_hora_pedido DESC;
    `
    );

    return rows;
  }
}
