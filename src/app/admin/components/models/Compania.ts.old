export class Compania {

  static companiaDesdeJson(obj: any) {
    return new Compania(
      obj['codigo'],
      obj['codigo_cia'],
      obj['origen_dato'],
      obj['origen_puerto'],
      obj['origen_name_DB'],
      obj['origen_user'],
      obj['origen_clave'],
      obj['email_smtp'],
      obj['email_puerto'],
      obj['email_salida'],
      obj['email_clave'],
      obj['email_tema'],
      obj['email_mensaje'],
      obj['email_office_365'],
      obj['createdIp'],
      obj['createdAt'],
      obj['updatedIp'],
      obj['updatedAt'],
      obj['cia_logo'],
      obj['vista_lista'],
    )
  }

  constructor(
    public codigo: String,
    public codigo_cia: String,
    public origen_dato: String,
    public origen_puerto: String,
    public origen_name_DB: String,
    public origen_user: String,
    public origen_clave: String,
    public email_smtp: String,
    public email_puerto: String,
    public email_salida: String,
    public email_clave: String,
    public email_tema: String,
    public email_mensaje: String,
    public email_office_365: Boolean,
    public createdIp: String,
    public createdAt: Date,
    public updatedIp: String,
    public updatedAt: Date,
    public cia_logo?: Blob,
    public vista_lista?: String,
  ) {}

}
