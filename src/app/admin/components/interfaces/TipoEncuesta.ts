export interface TiposEncuesta {
  data: TipoEncuesta[];
}

interface TipoEncuesta {
    codigo: String,
    identificador: String,
    descripcion: String,
    afectacion: String,
    createdIp: String,
    createdAt: Date,
    updatedIp: String,
    updatedAt: Date
}
