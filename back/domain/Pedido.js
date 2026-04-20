// domain/Pedido.js
export class Pedido {
  constructor(data = {}) {
    this.nropedido = data.nropedido ?? null;
    this.comentarios = data.comentarios ?? null;
    this.fecha_hora_pedido = data.fecha_hora_pedido ?? null;

    this.idmodalidad = data.idmodalidad ?? null;
    this.idestadop = data.idestadop ?? 1;

    this.direccion = data.direccion ?? null;
    this.documento = data.documento ?? null;

    this.platos = Array.isArray(data.platos) ? data.platos : [];
  }

  static errorBadRequest(msg) {
    const err = new Error(msg);
    err.status = 400;
    return err;
  }

  validarCrear() {
    if (!this.documento) {
      throw Pedido.errorBadRequest("El documento del cliente es obligatorio");
    }

    if (!this.idmodalidad) {
      throw Pedido.errorBadRequest("La modalidad es obligatoria");
    }

    // asumo: modalidad 1 = delivery
    if (this.idmodalidad === 1 && !this.direccion) {
      throw Pedido.errorBadRequest(
        "La dirección es obligatoria para modalidad delivery"
      );
    }

    if (this.platos.length === 0) {
      throw Pedido.errorBadRequest("El pedido debe tener al menos un plato");
    }
  }

  static fromDbRow(row, platos = []) {
    return new Pedido({
      nropedido: row.nropedido,
      comentarios: row.comentarios,
      fecha_hora_pedido: row.fecha_hora_pedido,
      idmodalidad: row.idmodalidad,
      idestadop: row.idestadop,
      direccion: row.direccion,
      documento: row.documento,
      platos,
    });
  }
}
