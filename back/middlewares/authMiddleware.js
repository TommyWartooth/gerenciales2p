import jwt from 'jsonwebtoken'; // Importación por defecto

export const checkRole = (roles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: "No hay token, autorización denegada" });
        }

        const token = authHeader.split(' ')[1];

        try {
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ msg: "No tienes permiso para acceder a esta ruta" });
            }

            next();
        } catch (err) {
            res.status(401).json({ msg: "Token no es válido" });
        }
    };
};