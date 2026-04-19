import { Router } from 'express';
const router = Router();
import { login } from '../controllers/authController.js';
import { registrarCliente, registrarPersonal } from '../controllers/usuarioController.js'; 
import { checkRole } from '../middlewares/authMiddleware.js';

router.post('/login', login);
router.post('/registro-cliente', registrarCliente); 

router.post('/registro-personal', checkRole(['administrador']), registrarPersonal);

router.get('/admin-data', checkRole(['administrador']), (req, res) => {
    res.json({ msg: "Datos secretos del jefe" });
});

router.get('/citas', checkRole(['administrador', 'recepcionista']), (req, res) => {
    res.json({ msg: "Lista de citas para hoy" });
});

export default router;