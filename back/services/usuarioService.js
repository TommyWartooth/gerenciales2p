import { pool } from "../db/pool.js";
import { UsuarioCliente, UsuarioPersonal } from "../domain/Usuario.js";
import bcrypt from "bcryptjs";

const t_cliente = 1;
const t_personal = 2;

export class UsuarioService {
  
  // ==========================================
  // --- MÉTODOS DE CLIENTE ---
  // ==========================================

  async getClientes() {
    const query = `
      SELECT u.*, c.nit, c.razon_social 
      FROM usuario_cliente c 
      JOIN usuario u ON u.documento = c.documento 
      ORDER BY u.documento;`;
    const { rows } = await pool.query(query);
    return rows.map((row) => UsuarioCliente.fromDbRow(row));
  }

  async createCliente(data) {
    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(data.contrasela, salt);

    const cliente = new UsuarioCliente({
      ...data,
      contrasela: passwordHasheada,
      idtipo: t_cliente
    });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { rowCount: yaExiste } = await client.query(
        "SELECT 1 FROM usuario WHERE documento = $1", [cliente.documento]
      );
      if (yaExiste > 0) throw Object.assign(new Error("Usuario ya existe"), { status: 409 });

      await client.query(
        `INSERT INTO usuario (documento, nombre, apellidos, fecha_nac, correo, contrasela, celular, telefono_fijo, idtipo, fotoperfil)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [cliente.documento, cliente.nombre, cliente.apellidos, cliente.fecha_nac, cliente.correo, cliente.contrasela, cliente.celular, cliente.telefono_fijo, cliente.idtipo, cliente.fotoperfil]
      );

      await client.query(
        "INSERT INTO usuario_cliente (documento, nit, razon_social) VALUES ($1, $2, $3)",
        [cliente.documento, cliente.nit, cliente.razon_social]
      );

      await client.query("COMMIT");
      return { msg: "Cliente creado con éxito" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  // ==========================================
  // --- MÉTODOS DE PERSONAL (CRUD ADMIN) ---
  // ==========================================

  async getPersonal() {
    const query = `
      SELECT u.*, p.idrol, p.fecha_contrato, r.nombre AS nombre_rol
      FROM usuario_personal p 
      JOIN usuario u ON u.documento = p.documento 
      JOIN rol r ON p.idrol = r.idrol
      ORDER BY u.documento;`;
    const { rows } = await pool.query(query);
    return rows.map((row) => UsuarioPersonal.fromDbRow(row));
  }

  async getPersonalByDoc(documento) {
    const query = `
      SELECT u.*, p.idrol, p.fecha_contrato, r.nombre AS nombre_rol
      FROM usuario_personal p 
      JOIN usuario u ON u.documento = p.documento 
      JOIN rol r ON p.idrol = r.idrol
      WHERE u.documento = $1;`;
    const { rows } = await pool.query(query, [documento]);
    if (rows.length === 0) return null;
    return UsuarioPersonal.fromDbRow(rows[0]);
  }

  async createPersonal(data) {
    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(data.contrasela, salt);

    const personal = new UsuarioPersonal({
      ...data,
      contrasela: passwordHasheada,
      idtipo: t_personal
    });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { rowCount: esPersonal } = await client.query(
        "SELECT 1 FROM usuario_personal WHERE documento = $1", [personal.documento]
      );
      if (esPersonal > 0) throw Object.assign(new Error("Ya está registrado como personal"), { status: 409 });

      const { rowCount: yaUsuario } = await client.query(
        "SELECT 1 FROM usuario WHERE documento = $1", [personal.documento]
      );

      if (yaUsuario === 0) {
        await client.query(
          `INSERT INTO usuario (documento, nombre, apellidos, fecha_nac, correo, contrasela, celular, telefono_fijo, idtipo, fotoperfil)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [personal.documento, personal.nombre, personal.apellidos, personal.fecha_nac, personal.correo, personal.contrasela, personal.celular, personal.telefono_fijo, t_personal, personal.fotoperfil]
        );
      } else {
        await client.query("UPDATE usuario SET idtipo = $2 WHERE documento = $1", [personal.documento, t_personal]);
        await client.query("DELETE FROM usuario_cliente WHERE documento = $1", [personal.documento]);
      }

      await client.query(
        "INSERT INTO usuario_personal (documento, idrol, fecha_contrato) VALUES ($1, $2, NOW())",
        [personal.documento, personal.idrol]
      );

      await client.query("COMMIT");
      return { msg: "Personal creado con éxito" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async updatePersonal(documento, data) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { rows } = await client.query("SELECT * FROM usuario WHERE documento = $1", [documento]);
      if (rows.length === 0) throw Object.assign(new Error("Personal no encontrado"), { status: 404 });

      const actual = rows[0];
      
      let passwordFinal = actual.contrasela;
      if (data.contrasela) {
        const salt = await bcrypt.genSalt(10);
        passwordFinal = await bcrypt.hash(data.contrasela, salt);
      }

      await client.query(
        `UPDATE usuario SET nombre=$2, apellidos=$3, correo=$4, contrasela=$5, celular=$6, telefono_fijo=$7, fotoperfil=$8 
         WHERE documento=$1`,
        [documento, data.nombre ?? actual.nombre, data.apellidos ?? actual.apellidos, data.correo ?? actual.correo, 
         passwordFinal, data.celular ?? actual.celular, data.telefono_fijo ?? actual.telefono_fijo, data.fotoperfil ?? actual.fotoperfil]
      );

      if (data.idrol) {
        await client.query("UPDATE usuario_personal SET idrol = $2 WHERE documento = $1", [documento, data.idrol]);
      }

      await client.query("COMMIT");
      return { msg: "Personal actualizado correctamente" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async deletePersonal(documento) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query("DELETE FROM usuario_personal WHERE documento = $1", [documento]);
      
      const { rowCount: esCliente } = await client.query("SELECT 1 FROM usuario_cliente WHERE documento = $1", [documento]);
      if (esCliente === 0) {
        await client.query("DELETE FROM usuario WHERE documento = $1", [documento]);
      }

      await client.query("COMMIT");
      return { msg: "Personal eliminado correctamente" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}