import { Router } from 'express';
import { 
    getPlatos, 
    getPlatoById, 
    getPlatosPorCategoria, 
    CreatePlato, 
    updatePlato, 
    deletePlato 
} from '../controllers/platoController.js';
import { checkRole } from '../middlewares/authMiddleware.js';

const router = Router();

// --- RUTAS PÚBLICAS O PARA CUALQUIER USUARIO LOGUEADO ---
// Los clientes pueden ver el menú, así que permitimos 'cliente', 'recepcionista' y 'administrador'
//router.get('/', checkRole(['cliente', 'recepcionista', 'administrador']), getPlatos);
//router.get('/:id', checkRole(['cliente', 'recepcionista', 'administrador']), getPlatoById);
 //router.get('/categoria/:idcategoria', checkRole(['cliente', 'recepcionista', 'administrador']), getPlatosPorCategoria);

router.get('/', getPlatos);
router.get('/:id', getPlatoById);
router.get('/categoria/:idcategoria',getPlatosPorCategoria);

// --- RUTAS SOLO PARA EL ADMIN ---
// Solo el jefe puede meterle mano a la carta
router.post('/', checkRole(['administrador']), CreatePlato);
router.put('/:id', checkRole(['administrador']), updatePlato);
router.delete('/:id', checkRole(['administrador']), deletePlato);

export default router;