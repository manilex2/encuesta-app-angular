import { Preguntas } from "."

export interface Client {
  codigo?: any,
  codigo_cia?: any,
  encuestas?: [{
    identificador?: any,
    descripcion?: any,
    preguntas?: Preguntas[]
  }]
}
