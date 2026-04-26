import { UsuarioService } from '../services/usuarioservice.js';
const usuarioService = new UsuarioService();

// ==========================================
// --- CONTROLLERS DE CLIENTE ---
// ==========================================

export const obtenerClientes = async (req, res) => {
    try {
        const clientes = await usuarioService.getClientes();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener clientes" });
    }
};

export const registrarCliente = async (req, res) => {
    try {
        const resultado = await usuarioService.createCliente(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        console.error("🔥 ERROR EXACTO AL REGISTRAR:", error);
        res.status(error.status || 500).json({ msg: error.message });
    }
};

export const actualizarPerfilCliente = async (req, res) => {
    try {
        // Extraemos el documento de req.user (inyectado por el middleware checkRole)
        const documento = req.user.documento; 
        
        const resultado = await usuarioService.updateCliente(documento, req.body);
        res.json(resultado);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

// ==========================================
// --- CONTROLLERS DE PERSONAL (CRUD ADMIN) ---
// ==========================================

export const obtenerTodoElPersonal = async (req, res) => {
    try {
        const personal = await usuarioService.getPersonal();
        res.json(personal);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el personal" });
    }
};

export const obtenerPersonalPorDoc = async (req, res) => {
    try {
        const { doc } = req.params;
        const personal = await usuarioService.getPersonalByDoc(doc);
        if (!personal) return res.status(404).json({ msg: "Personal no encontrado" });
        res.json(personal);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const registrarPersonal = async (req, res) => {
    try {
        const resultado = await usuarioService.createPersonal(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

export const actualizarPersonal = async (req, res) => {
    try {
        const { doc } = req.params;
        const resultado = await usuarioService.updatePersonal(doc, req.body);
        res.json(resultado);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};

export const eliminarPersonal = async (req, res) => {
    try {
        const { doc } = req.params;
        const resultado = await usuarioService.deletePersonal(doc);
        res.json(resultado);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
    }
};