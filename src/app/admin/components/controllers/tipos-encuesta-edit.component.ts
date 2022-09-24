import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { Appstate } from 'src/app/shared/store/AppState';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { TipoEncuestaService } from '../../services/tipo-encuesta.service';
import { UPDATE_TIPOS_ENCUESTA } from '../../store/actions/tiposencuesta.actions';
import { currentUser } from '../../store/selectors/currentuser.selectors';
import { selectTipoEncuestaById } from '../../store/selectors/tiposencuesta.selectors';
import { TiposEncuesta } from '../models';

@Component({
  selector: 'app-tipos-encuesta-edit',
  templateUrl: '../views/tipos-encuesta-edit.component.html',
  styleUrls: ['../styles/tipos-encuesta-edit.component.scss']
})
export class TiposEncuestaEditComponent implements OnInit {

  currentUser: any;
  routeParams: any;

  constructor(
    private fb: FormBuilder,
    private tipoEncuestaService: TipoEncuestaService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private appStore: Store<Appstate>,
  ) { }

  ngOnInit(): void {
    this.store.pipe(select(currentUser)).subscribe(currentUser => {
      this.currentUser = currentUser;
    })
    this.getIp();
    let fetchData$ = this.route.paramMap.pipe(
      switchMap((params) => {
        var codigo = String(params.get('codigo'));
        var identificador = String(params.get('identificador'));
        return this.store.pipe(select(selectTipoEncuestaById(codigo, identificador)));
      })
    );
    fetchData$.subscribe((data) => {
      if (data) {
        this.updateTipoEncuestaForm.controls.codigo?.setValue(data.codigo);
        this.updateTipoEncuestaForm.controls.identificador?.setValue(data.identificador);
        this.updateTipoEncuestaForm.controls.descripcion?.setValue(data.descripcion);
        this.updateTipoEncuestaForm.controls.afectacion?.setValue(data.afectacion);
        this.routeParams = {
          codigo: data.codigo,
          idenfificador: data.identificador
        }
      }
      else{
        this.router.navigate(['/admin/tipos_encuesta']);
      }
    });
  }

  updateTipoEncuestaForm = this.fb.group({
    codigo: ["", [Validators.required, Validators.pattern(/[0-9]{3}/g)]],
    identificador: ["", [Validators.required, Validators.maxLength(3)]],
    afectacion: ["CLIENTE", [Validators.required, Validators.maxLength(10)]],
    descripcion: ["", [Validators.required, Validators.maxLength(100)]],
    updatedIp: ["", Validators.required],
  });

  getIp() {
    return this.tipoEncuestaService.getIPAddress().subscribe((res: any) => {
      this.updateTipoEncuestaForm.controls.updatedIp?.setValue(res.ip);
    })
  };

  onUpdate() {
    try {

      this.store.dispatch(UPDATE_TIPOS_ENCUESTA({updateTipoEncuesta: { ...this.updateTipoEncuestaForm.value }, identificador: this.routeParams.idenfificador, codigo: this.routeParams.codigo}));
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.tiposEncuestaState === "updated") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, tiposEncuestaState: "done" } }));
          this.toastr.success("Tipo de encuesta actualizada exitosamente.", "Tipo de Encuesta", {
            progressBar: true
          });
          this.router.navigate(['/admin/tipos_encuesta']);
        } else if (data.apiStatus === 'error'){
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200 } }));
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
  };

}
