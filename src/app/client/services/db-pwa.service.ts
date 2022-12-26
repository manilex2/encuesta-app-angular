import { Injectable } from '@angular/core';
import PouchDB from "pouchdb-browser";

@Injectable({
  providedIn: 'root'
})
export class DbPwaService {
  private db: any;

  constructor() {
    this.db = new PouchDB("respuestas");
  }

  public addData = (dataScheme: any) => {
    this.db.get(dataScheme._id)
    .then((doc: any) => {
      console.log("[LOCAL]: Encontrado y Actualizado");
      delete dataScheme.docReferencia;
      doc = Object.assign(doc, dataScheme);
      this.db.put(doc);
    }).catch(() => {
      this.db.post(dataScheme);
      console.log("[LOCAL]: Se creo nuevo registro local");
    });
  }

  public getAll = () => new Promise((resolve, reject) => {
    this.db.allDocs({
      include_docs: true,
      attachments: true
    })
    .then(({rows}) => {
      resolve(rows);
    })
    .catch(() => {
      reject(null);
    })
  })

  public clearData = async (data: any) => {
    if (data._id) {
      try {
        var doc = await this.db.get(data._id);
        var response = await this.db.remove(doc);
        return response;
      } catch (err) {
        console.log(err);
      }
    }
  };
}
