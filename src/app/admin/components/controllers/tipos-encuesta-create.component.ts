import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { Appstate } from 'src/app/shared/store/AppState';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { TipoEncuestaService } from '../../services/tipo-encuesta.service';
import { CREATE_TIPOS_ENCUESTA } from '../../store/actions/tiposencuesta.actions';
import { currentUser } from '../../store/selectors/currentuser.selectors';
import { TiposEncuesta } from '../models';

@Component({
  selector: 'app-tipos-encuesta-create',
  templateUrl: '../views/tipos-encuesta-create.component.html',
  styleUrls: ['../styles/tipos-encuesta-create.component.scss']
})
export class TiposEncuestaCreateComponent implements OnInit {

  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private tipoEncuestaService: TipoEncuestaService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private appStore: Store<Appstate>,
  ) { }

  ngOnInit(): void {
    this.store.pipe(select(currentUser)).subscribe(currentUser => {
      this.currentUser = currentUser;
      if (!this.currentUser.fsbs) {
        this.createTipoEncuestaForm.controls.codigo?.setValue(this.currentUser.codigo);
      }
    })
    this.getIp();
  };

  createTipoEncuestaForm = this.fb.group<TiposEncuesta>({
    codigo: ["", [Validators.required, Validators.pattern(/[0-9]{3}/g)]],
    identificador: ["", [Validators.required, Validators.maxLength(3)]],
    afectacion: ["CLIENTE", [Validators.required, Validators.maxLength(10)]],
    descripcion: ["", [Validators.required, Validators.maxLength(100)]],
    createdIp: ["", Validators.required],
  });

  getIp() {
    return this.tipoEncuestaService.getIPAddress().subscribe((res: any) => {
      this.createTipoEncuestaForm.controls['createdIp']?.setValue(res.ip);
    })
  };

  onSubmit() {
    try {
      this.store.dispatch(CREATE_TIPOS_ENCUESTA({newTipoEncuesta: {...this.createTipoEncuestaForm.value}}));
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.tiposEncuestaState === "created" && data.loginStatus === "logged") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, tiposEncuestaState: "done" } }));
          this.toastr.success("Compañía creada exitosamente.", "Tipo de Encuesta", {
            progressBar: true
          });
          this.router.navigate(['/admin/tipos_encuesta']);
        } else if (data.apiStatus === 'error' && data.tiposEncuestaState === "createdError" && data.loginStatus === "logged"){
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, tiposEncuestaState: "" } }));
          this.toastr.error(data.apiResponseMessage, "Tipo de Encuesta", {
            progressBar: true,
            timeOut: 8000
          });
          if (data.apiCodeStatus === 401) {
            this.router.navigate(['/']);
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

}
