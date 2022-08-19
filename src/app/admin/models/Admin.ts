export class Admin {

  static adminDesdeJson(obj: any) {
    return new Admin(
      obj['codigo'],
      obj['nombre'],
      obj['fsbs'],
      obj['createdIp'],
      obj['createdAt'],
      obj['updatedIp'],
      obj['updatedAt'],
      obj['logo'],
      obj['clave'],
    )
  }

  constructor(
    public codigo: String,
    public nombre: String,
    public fsbs: Boolean,
    public createdIp: String,
    public createdAt: Date,
    public updatedIp: String,
    public updatedAt: Date,
    public logo?: Blob,
    public clave?: String,
  ) {}

}
