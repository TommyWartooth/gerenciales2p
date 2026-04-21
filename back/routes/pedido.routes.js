import { Router } from "express";
import {
  getAllPedidos,
  getPedidoById,
  crearPedido,
  actualizarPedidoCompleto,
  eliminarPedido,
  actualizarEstadoPedido,
  getPedidosHistorial,
} from "../controllers/pedido.controller.js";

const router = Router();

router.get("/", getAllPedidos);

router.patch("/:nropedido/estado", actualizarEstadoPedido);

router.post("/", crearPedido);

export default router;
