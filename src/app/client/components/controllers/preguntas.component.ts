import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-preguntas',
  templateUrl: '../views/preguntas.component.html',
  styleUrls: ['../styles/preguntas.component.scss']
})
export class PreguntasComponent implements OnInit {
  formGroup!: FormGroup;
  preguntas!: FormArray;
  data = [{
    numero: 1,
    tipo: "C",
    pregunta: "TE ATENDIERON SATISFACTORIAMENTE",
    respuestas: {
      a: "MALO",
      b: "BUENO",
      c: "EXCELENTE",
      d: null,
      e: null,
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
      e: null,
    },
  }, {
    numero: 3,
    tipo: "C",
    pregunta: "TIENES PERRO",
    respuestas: {
      a: "SI",
      b: "NO",
      c: null,
      d: null,
      e: null,
    },
  }]

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      preguntas: this.fb.array([])
    })
    this.preguntas = this.formGroup.get('preguntas') as FormArray;
    for (let i = 0; i < this.data.length; i++) {
      const element = this.data[i];
      this.preguntas.push(this.init(element));
    }
  }

  init(data: Object){
    return this.fb.group({...data, selected: ["", [Validators.required]]})
  }

  sendData(){
    console.log(this.formGroup.value);
  }
}
