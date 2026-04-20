import { PedidoService } from "../services/pedido.service.js";
//import { enviarCorreoEstadoPedido } from "../services/emailService.js";

const pedidoService = new PedidoService();

export const getAllPedidos = async (req, res, next) => {
  try {
    const pedidos = await pedidoService.getAll();
    res.json(pedidos);
  } catch (err) {
    next(err);
  }
};

export const getPedidoById = async (req, res, next) => {
  try {
    const nropedido = parseInt(req.params.nropedido, 10);
    if (Number.isNaN(nropedido)) {
      return res.status(400).json({ message: "nropedido inválido" });
    }

    const pedido = await pedidoService.getById(nropedido);

    if (!pedido) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json(pedido);
  } catch (err) {
    next(err);
  }
};

export const crearPedido = async (req, res, next) => {
  try {
    const data = req.body;
    const pedidoCreado = await pedidoService.create(data);
    res.status(201).json(pedidoCreado);
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

export const actualizarPedidoCompleto = async (req, res, next) => {
  try {
    const nropedido = parseInt(req.params.nropedido, 10);

    if (Number.isNaN(nropedido)) {
      return res.status(400).json({ message: "nropedido inválido" });
    }

    const data = req.body;

    const pedidoActualizado = await pedidoService.updateCompleto(
      nropedido,
      data
    );

    if (!pedidoActualizado) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.json(pedidoActualizado);
  } catch (err) {
    next(err);
  }
};

export const eliminarPedido = async (req, res, next) => {
  try {
    const nropedido = parseInt(req.params.nropedido, 10);

    if (Number.isNaN(nropedido)) {
      return res.status(400).json({ message: "nropedido inválido" });
    }

    const eliminado = await pedidoService.delete(nropedido);

    if (!eliminado) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const actualizarEstadoPedido = async (req, res, next) => {
  try {
    const nropedido = parseInt(req.params.nropedido, 10);
    if (Number.isNaN(nropedido)) {
      return res.status(400).json({ message: "nropedido inválido" });
    }

    const { idestadop, estadoTexto } = req.body;

    if (!idestadop) {
      return res
        .status(400)
        .json({ message: "Falta idestadop (nuevo estado del pedido)" });
    }

    const resultado = await pedidoService.actualizarEstado(
      nropedido,
      idestadop
    );

    if (!resultado) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    // 👉 Si no mandas estadoTexto desde el front, usamos el nombre real del estado de la BD
    const textoEstado =
      estadoTexto || resultado.estado || `Estado #${resultado.idestadop}`;

    // Enviar correo (si hay correo de cliente)
    try {
      if (resultado.correoCliente) {
        await enviarCorreoEstadoPedido({
          correoCliente: resultado.correoCliente,
          estadoTexto: textoEstado,
          idPedido: resultado.nropedido,
          nombreCliente: resultado.nombreCliente,
        });
      }
    } catch (errCorreo) {
      console.error("Error enviando correo de estado:", errCorreo);
      // No rompemos la respuesta por fallo de correo
    }

    return res.json({
      message: "Estado actualizado correctamente",
      nropedido: resultado.nropedido,
      idestadop: resultado.idestadop,
      estado: resultado.estado,
    });
  } catch (err) {
    next(err);
  }
};

export const getPedidosHistorial = async (req, res, next) => {
  try {
    const pedidos = await pedidoService.getHistorial();
    return res.json(pedidos);
  } catch (err) {
    console.error("Error en getPedidosHistorial:", err);
    next(err);
  }
};
