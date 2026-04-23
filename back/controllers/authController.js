import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/pool.js";

export const login = async (req, res) => {
  const { documento, contrasela } = req.body;

  try {
    // 1. Modificamos la consulta para traer TODOS los datos necesarios
    const query = `
      SELECT 
        u.documento, u.nombre, u.apellidos, u.correo, u.celular, u.telefono_fijo, u.contrasela, u.idtipo,
        c.nit, c.razon_social,
        r.nombre as nombre_rol
      FROM usuario u
      LEFT JOIN usuario_personal p ON u.documento = p.documento
      LEFT JOIN rol r ON p.idrol = r.idrol
      LEFT JOIN usuario_cliente c ON u.documento = c.documento
      WHERE u.documento = $1
    `;

    const result = await pool.query(query, [documento]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(contrasela, user.contrasela);

    if (!isMatch) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    let rolFinal = user.idtipo === 1 ? "cliente" : user.nombre_rol;

    const token = jwt.sign(
      { documento: user.documento, role: rolFinal },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    // 2. Devolvemos el objeto usuario completo al frontend
    res.json({
      ok: true,
      token,
      usuario: {
        documento: user.documento,
        nombre: user.nombre,
        apellidos: user.apellidos,
        correo: user.correo,
        celular: user.celular,
        telefono_fijo: user.telefono_fijo,
        nit: user.nit,
        razon_social: user.razon_social,
        rol: rolFinal,
      },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};