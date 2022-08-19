export interface Admins {
  data: Admin[];
}

interface Admin {
    codigo: String,
    nombre: String,
    fsbs: Boolean,
    createdIp: String,
    createdAt: Date,
    updatedIp: String,
    updatedAt: Date,
    logo?: Blob,
    clave?: String,
}
