
class Usuario {
  constructor({ documento, nombre, apellidos, fecha_nac, correo, contrasela, celular, telefono_fijo, idtipo, fotoperfil }) {
    this.documento = documento;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.fecha_nac = fecha_nac;
    this.correo = correo;
    this.contrasela = contrasela; 
    this.celular = celular;
    this.telefono_fijo = telefono_fijo;
    this.idtipo = idtipo;
    this.fotoperfil = fotoperfil;
  }
}

export class UsuarioCliente extends Usuario {
  constructor(data) {
    super(data); 
    this.nit = data.nit;
    this.razon_social = data.razon_social;
  }

  static fromDbRow(row) {
    return new UsuarioCliente({
      documento: row.documento,
      nombre: row.nombre,
      apellidos: row.apellidos,
      fecha_nac: row.fecha_nac,
      correo: row.correo,
      contrasela: row.contrasela,
      celular: row.celular,
      telefono_fijo: row.telefono_fijo,
      idtipo: row.idtipo,
      fotoperfil: row.fotoperfil,
      nit: row.nit,
      razon_social: row.razon_social
    });
  }
}

// 3. Clase para Personal (Hereda de Usuario)
export class UsuarioPersonal extends Usuario {
  constructor(data) {
    super(data);
    this.idrol = data.idrol;
    this.fecha_contrato = data.fecha_contrato;
  }

  static fromDbRow(row) {
    return new UsuarioPersonal({
      documento: row.documento,
      nombre: row.nombre,
      apellidos: row.apellidos,
      fecha_nac: row.fecha_nac,
      correo: row.correo,
      contrasela: row.contrasela,
      celular: row.celular,
      telefono_fijo: row.telefono_fijo,
      idtipo: row.idtipo,
      fotoperfil: row.fotoperfil,
      idrol: row.idrol,
      fecha_contrato: row.fecha_contrato
    });
  }
}