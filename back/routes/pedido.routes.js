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

// Esta es la ruta buena que ya tenías y que devuelve la lista
router.get("/", getAllPedidos);
router.get("/historial", getPedidosHistorial);
router.get("/:nropedido", getPedidoById);

// Borramos el router.get('/pedidos'...) extra que pusimos para que no choque

router.patch("/:nropedido/estado", actualizarEstadoPedido);
router.post("/", crearPedido);

export default router;
