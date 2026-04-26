import { Router } from 'express';
const router = Router();

import { login } from '../controllers/authController.js';
import { 
    registrarCliente, 
    obtenerClientes,
    actualizarPerfilCliente,
    registrarPersonal,
    obtenerTodoElPersonal,
    obtenerPersonalPorDoc,
    actualizarPersonal,
    eliminarPersonal
} from '../controllers/usuarioController.js'; 

import { checkRole } from '../middlewares/authMiddleware.js';

// ==========================================
// --- RUTAS PÚBLICAS ---
// ==========================================
router.post('/login', login);
router.post('/registro-cliente', registrarCliente); 

// ==========================================
// --- RUTAS DE CLIENTES ---
// ==========================================
router.get('/clientes', checkRole(['administrador', 'recepcionista']), obtenerClientes);
router.put('/perfil', checkRole(['cliente']), actualizarPerfilCliente);

// ==========================================
// --- RUTAS DE PERSONAL (SÓLO ADMIN) ---
// ==========================================
router.get('/personal', checkRole(['administrador']), obtenerTodoElPersonal);
router.get('/personal/:doc', checkRole(['administrador']), obtenerPersonalPorDoc);
router.post('/registro-personal', checkRole(['administrador']), registrarPersonal);
router.put('/personal/:doc', checkRole(['administrador']), actualizarPersonal);
router.delete('/personal/:doc', checkRole(['administrador']), eliminarPersonal);

// ==========================================
// --- RUTAS EXTRAS ---
// ==========================================
router.get('/admin-data', checkRole(['administrador']), (req, res) => {
    res.json({ msg: "Datos secretos del jefe" });
});

router.get('/citas', checkRole(['administrador', 'recepcionista']), (req, res) => {
    res.json({ msg: "Lista de citas para hoy" });
});

export default router;