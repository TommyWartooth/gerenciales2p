import { pool } from "../db/pool.js";
import { UsuarioCliente, UsuarioPersonal } from "../domain/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const t_cliente = 1;
const t_personal = 2;

export class UsuarioService {
  
  // --- MÉTODOS DE CLIENTE ---

  async createCliente(data) {
    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(data.contrasela, salt);

    const cliente = new UsuarioCliente({
      ...data,
      contrasela: passwordHasheada, // Guardamos la versión segura
      idtipo: t_cliente
    });

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Validaciones de existencia (puedes mantener tus validaciones actuales aquí)
      const { rowCount: yaExiste } = await client.query(
        "SELECT 1 FROM usuario WHERE documento = $1", [cliente.documento]
      );
      if (yaExiste > 0) throw Object.assign(new Error("Usuario ya existe"), { status: 409 });

      // Insert en tabla padre con FOTO PERFIL
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

  // --- MÉTODOS DE PERSONAL ---

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

      // Insert en tabla padre con FOTO PERFIL
      await client.query(
        `INSERT INTO usuario (documento, nombre, apellidos, fecha_nac, correo, contrasela, celular, telefono_fijo, idtipo, fotoperfil)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [personal.documento, personal.nombre, personal.apellidos, personal.fecha_nac, personal.correo, personal.contrasela, personal.celular, personal.telefono_fijo, t_personal, personal.fotoperfil]
      );

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

  // --- EL NUEVO LOGIN SEGURO ---

  async loginUsuario({ documento, contrasela }) {
    // 1. Buscamos al usuario y traemos su rol si es personal
    const query = `
      SELECT u.*, r.nombre AS nombre_rol
      FROM usuario u
      LEFT JOIN usuario_personal p ON u.documento = p.documento
      LEFT JOIN rol r ON p.idrol = r.idrol
      WHERE u.documento = $1`;
    
    const { rows } = await pool.query(query, [documento]);

    if (rows.length === 0) {
      throw Object.assign(new Error("Usuario no encontrado"), { status: 404 });
    }

    const user = rows[0];

    // 2. COMPARACIÓN SEGURA CON BCRYPT
    const esValida = await bcrypt.compare(contrasela, user.contrasela);
    if (!esValida) {
      throw Object.assign(new Error("Contraseña incorrecta"), { status: 401 });
    }

    // 3. DETERMINAR ROL PARA EL TOKEN
    // Si es tipo cliente, rol es 'cliente'. Si es personal, usamos el nombre del rol de la DB.
    const rolFinal = (user.idtipo === 1) ? 'cliente' : user.nombre_rol;

    // 4. GENERAR EL JWT
    const token = jwt.sign(
      { documento: user.documento, role: rolFinal },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return {
      ok: true,
      token, // Este es el que el front guardará
      usuario: {
        documento: user.documento,
        nombre: user.nombre,
        rol: rolFinal,
        foto: user.fotoperfil
      }
    };
  }
}