import { PlatosService } from "../services/platoService.js";

const platosService = new PlatosService();

export const getPlatos = async (req, res) => {
  try {
    const platos = await platosService.getAll();
    res.json(platos);
  } catch (error) {
    console.error("Error en getPlatos:", error);
    res.status(500).json({ message: "Error al obtener platos" });
  }
};

export const getPlatoById = async (req, res) => {
  const { id } = req.params;

  try {
    const plato = await platosService.getById(id);

    if (!plato) {
      return res.status(404).json({ message: "Plato no encontrado" });
    }

    res.json(plato);
  } catch (error) {
    console.error("Error en getPlatoById:", error);
    res.status(500).json({ message: "Error al obtener plato" });
  }
};

//Añadi esto para poder filtrar por categoria

export const getPlatosPorCategoria = async (req, res) => {
  try {
    const { idcategoria } = req.params; // viene de /api/platos/categoria/:idcategoria
    const platos = await platosService.getByCategory(idcategoria);
    res.json(platos);
  } catch (error) {
    console.error("Error en getPlatosPorCategoria:", error);
    res.status(500).json({ message: "Error obteniendo platos por categoría" });
  }
};

export const CreatePlato = async (req, res) => {
  try {
    const nuevoPlato = await platosService.create(req.body);
    res.status(200).json({
      message: "Plato creado con éxito",
      plato: nuevoPlato,
    });
  } catch (error) {
    console.error("Error en CreatePlato", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

export const deletePlato = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rowCount = await platosService.delete(id);
    if (rowCount === 0) {
      return res.status(404).json({ message: "Plato no encontrado" });
    }

    return res.sendStatus(204);
  } catch {
    console.error("Error al eliminar plato", error);
    return res.status(500).json({
      message: "Error al eliminar plato",
    });
  }
};

export const updatePlato = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const updated = await platosService.update(id, data);

    if (!updated) {
      return res.status(404).json({ message: "Plato no encontrado" });
    }

    return res.json({
      message: "Plato actualizado con éxito",
      plato: updated,
    });
  } catch (error) {
    console.error("Error en updatePlato", error);
    return res
      .status(500)
      .json({ message: "Error al actualizar plato", error: error.message });
  }
};
