import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import decode from 'jwt-decode';
import { ClientService } from '../../services/client.service';
import { DbPwaService } from '../../services/db-pwa.service';
import * as uuid from 'uuid';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-preguntas',
  templateUrl: '../views/preguntas.component.html',
  styleUrls: ['../styles/preguntas.component.scss']
})
export class PreguntasComponent implements OnInit {
  formGroup!: FormGroup;
  preguntas!: FormArray;
  token: any;
  data = [];

  identificador: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private dbPwaService: DbPwaService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.identificador = this.route.snapshot.paramMap.get('tipo_encuesta');

    this.token = localStorage.getItem('auth_token');

    let tokenPayload: any = this.token? decode(this.token) : false;

    let nombre = tokenPayload.nombre;

    let preguntas = tokenPayload.encuestas.filter((encuesta: { identificador: string; }) => encuesta.identificador == this.identificador);
    preguntas = preguntas.sort((x: { numero: number; }, y: { numero: number; }) => x.numero - y.numero);
    this.data = preguntas;
    let tipos_encuesta = tokenPayload.tipos_encuesta.filter((tipo_encuesta: { identificador: string; }) => tipo_encuesta.identificador == this.identificador);
    this.formGroup = this.fb.group({
      preguntas: this.fb.array([])
    });

    this.preguntas = this.formGroup.get('preguntas') as FormArray;

    for (let i = 0; i < this.data.length; i++) {
      const element = this.data[i];
      this.preguntas.push(this.init(element, tipos_encuesta, nombre));
    }
  }

  init(data: any, tipos_encuesta: any, nombre: any){
    return this.fb.group({
      ...data,
      docReferencia: uuid.v4(),
      nombre: nombre,
      respuestas: this.fb.array(data.respuestas),
      afectacion: tipos_encuesta[0].afectacion,
      descripcion: tipos_encuesta[0].descripcion,
      selected: ["", [Validators.required]]
    });
  }

  sendData(){
    this.clientService.saveClientData(this.formGroup.value).subscribe(data => {
      this.toastr.success("Respuestas enviadas con éxito.", "Encuesta", {
        progressBar: true
      });
      this.router.navigate(['user']);
    }, () => {
      this.toastr.info("La encuesta no pudo enviarse porque no hay conexión, se guardo en local, cuando sea reestablecida la conexión se sincronizará.", "Encuesta", {
        progressBar: true,
        timeOut: 12000
      });
      this.dbPwaService.addData(this.formGroup.value);
      this.router.navigate(['user']);
    });
  }
}
