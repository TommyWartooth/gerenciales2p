import { UsuarioService } from '../services/usuarioservice.js';
const usuarioService = new UsuarioService();

export const registrarCliente = async (req, res) => {
    try {
        const resultado = await usuarioService.createCliente(req.body);
        res.status(201).json(resultado);
    } catch (error) {
        res.status(error.status || 500).json({ msg: error.message });
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