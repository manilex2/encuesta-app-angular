export interface Admin {
  codigo: string;
  nombre: string;
  fsbs: boolean;
  createdIp: string;
  createdAt: Date;
  updatedIp: string;
  updatedAt: Date;
  logo?: Blob;
  clave?: string;
}
