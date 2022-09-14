export interface Compania {
  codigo: String;
  codigo_cia: String;
  origen_dato: String;
  origen_puerto: String;
  origen_name_DB: String;
  origen_user: String;
  origen_clave: String;
  email_smtp: String;
  email_puerto: String;
  email_salida: String;
  email_clave: String;
  email_tema: String;
  email_mensaje: String;
  email_office_365: Boolean;
  createdIp: String;
  createdAt: Date;
  updatedIp: String;
  updatedAt: Date;
  cia_logo?: Blob;
  vista_lista?: String;
}
