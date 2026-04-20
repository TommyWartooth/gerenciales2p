import { PedidoService } from "../services/pedido.service.js";
import { enviarCorreoEstadoPedido } from "../services/emailService.js";

const pedidoService = new PedidoService();

export const getAllPedidos = async (req, res, next) => {
  try {
    const pedidos = await pedidoService.getAll();
    res.json(pedidos);
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
      idestadop,
    );

    if (!resultado) {
      return res.status(404).json({ message: "Pedido no encontrado" });
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
