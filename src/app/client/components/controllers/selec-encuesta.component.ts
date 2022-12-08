import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-selec-encuesta',
  templateUrl: '../views/selec-encuesta.component.html',
  styleUrls: ['../styles/selec-encuesta.component.scss']
})
export class SelecEncuestaComponent implements OnInit {

  example = [{
    admin: "001",
    comp: "01",
    codigo: "FA",
    encuesta: "FACTURA",
    preguntas: [{
      numero: 1,
      tipo: "C",
      pregunta: "TE ATENDIERON SATISFACTORIAMENTE",
      respuestas: {
        a: "MALO",
        b: "BUENO",
        c: "EXCELENTE",
        d: null,
        e: null
      }
    },{
      numero: 2,
      tipo: "C",
      pregunta: "TIENES HIJOS",
      respuestas: {
        a: "SI",
        b: "NO",
        c: null,
        d: null,
        e: null
      }
    }]
  }, {
    admin: "001",
    comp: "01",
    codigo: "GR",
    encuesta: "GUIA DE REMICION",
    preguntas: [{
      numero: 1,
      tipo: "C",
      pregunta: "La mercadería llego en presfecto estado",
      respuestas: {
        a: "SI",
        b: "NO",
        c: null,
        d: null,
        e: null
      }
    },{
      numero: 2,
      tipo: "C",
      pregunta: "LE LLEGO EL CORREO ELECTRONICO",
      respuestas: {
        a: "SI",
        b: "NO",
        c: null,
        d: null,
        e: null
      }
    }]
  }, {
    admin: "001",
    comp: "01",
    codigo: "ND",
    encuesta: "NOTA DE DEBITO",
    preguntas: [{
      numero: 1,
      tipo: "C",
      pregunta: "VINO Y SE FUE",
      respuestas: {
        a: "SI",
        b: "NO",
        c: "TAL VEZ",
        d: null,
        e: null
      }
    }]
  }]

  constructor() { }

  ngOnInit(): void {
  }

}
