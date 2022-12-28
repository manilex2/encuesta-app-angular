import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { DbPwaService } from '../../services/db-pwa.service';
import * as uuid from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';
import { currentUser } from 'src/app/admin/store/selectors/currentuser.selectors';
import { GET_CURRENT_USER } from 'src/app/admin/store/actions/currentuser.actions';

@Component({
  selector: 'app-preguntas',
  templateUrl: '../views/preguntas.component.html',
  styleUrls: ['../styles/preguntas.component.scss']
})
export class PreguntasComponent implements OnInit {
  formGroup!: FormGroup;
  preguntas!: FormArray;
  data = [];

  identificador: string;
  ip;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private dbPwaService: DbPwaService,
    private router: Router,
    private toastr: ToastrService,
    private store: Store
  ) {}

  getIp() {
    return this.clientService.getIPAddress().subscribe((res: any) => {
      this.ip = res.ip;
    })
  }

  ngOnInit() {
    this.getIp();
    this.identificador = this.route.snapshot.paramMap.get('tipo_encuesta');
    this.store.pipe(select(currentUser))
    .subscribe(current => {
      this.store.dispatch(GET_CURRENT_USER());
      let nombre = current.nombre;
      let preguntas = current.encuestas.filter((encuesta: { identificador: string; }) => encuesta.identificador == this.identificador);
      preguntas = preguntas.sort((x: { numero: number; }, y: { numero: number; }) => x.numero - y.numero);
      this.data = preguntas;
      let tipos_encuesta = current.tipos_encuesta.filter((tipo_encuesta: { identificador: string; }) => tipo_encuesta.identificador == this.identificador);
      this.formGroup = this.fb.group({
        preguntas: this.fb.array([])
      });

      this.preguntas = this.formGroup.get('preguntas') as FormArray;
      for (let i = 0; i < this.data.length; i++) {
        const element = this.data[i];
        this.preguntas.push(this.init(element, tipos_encuesta, nombre));
      }
    });
  }

  init(data: any, tipos_encuesta: any, nombre: any){
    return this.fb.group({
      ...data,
      docReferencia: uuid.v4(),
      nombre: nombre,
      respuestas: this.fb.array(data.respuestas),
      afectacion: tipos_encuesta[0].afectacion,
      descripcion: tipos_encuesta[0].descripcion,
      selected: ["", [Validators.required]],
      ip: ""
    });
  }

  sendData(){
    this.clientService.saveClientData({...this.formGroup.value, ip: this.ip}).subscribe(data => {
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
