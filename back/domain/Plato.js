    export class Plato {
  constructor({
    id,
    nombre,
    costo_unitario,
    descripcion,
    disponibilidad,
    imagen,
    idcategoria,
  }) {
    this.id = id;
    this.nombre = nombre;
    this.costo_unitario = costo_unitario;
    this.descripcion = descripcion;
    this.disponibilidad = disponibilidad;
    this.imagen = imagen;
    this.idcategoria = idcategoria;
  }

  validar() {
    if (!this.nombre) throw new Error("El nombre es obligatorio");
    if (!this.costo_unitario)
      throw new Error("El costo_unitario es obligatorio");
    if (this.costo_unitario <= 0) throw new Error("costo_unitario inválido");
  }

  static fromDbRow(row) {
    return new Plato({
      id: row.idplato,
      nombre: row.nombre,
      costo_unitario: Number(row.costo_unitario),
      descripcion: row.descripcion,
      disponibilidad: row.disponibilidad,
      imagen: row.imagen,
      idcategoria: row.idcategoria,
    });
  }
}
