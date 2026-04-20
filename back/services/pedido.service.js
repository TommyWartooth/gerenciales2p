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
}
