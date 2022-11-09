import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/services/auth.service';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { Appstate } from 'src/app/shared/store/AppState';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { AdminService } from '../../services/admin.service';
import { TipoEncuestaService } from '../../services/tipo-encuesta.service';
import { GET_COMPANIAS } from '../../store/actions/companias.actions';
import { CREATE_TIPOS_ENCUESTA, CREATE_TIPOS_ENCUESTA_SUCCESS } from '../../store/actions/tiposencuesta.actions';
import { companias } from '../../store/selectors/companias.selectors';
import { currentUser } from '../../store/selectors/currentuser.selectors';
import { Compania, TiposEncuesta } from '../models';

export interface CompaniaLista {
  codigo?: string;
  codigo_cia?: string;
  completed?: boolean;
  companias?: CompaniaLista[];
  admins?: CompaniaLista[];
}

@Component({
  selector: 'app-tipos-encuesta-create',
  templateUrl: '../views/tipos-encuesta-create.component.html',
  styleUrls: ['../styles/tipos-encuesta-create.component.scss']
})
export class TiposEncuestaCreateComponent implements OnInit {

  hide = true;
  currentUser: any;
  companias: any[] = [];
  compList: Compania[] = [];
  compAdminList: Compania[] = [];
  compChecked: any = [];
  companiaLista: CompaniaLista = {
    codigo: "000",
    codigo_cia: "00",
    completed: false,
    companias: this.compList,
    admins: this.compAdminList
  };
  allComplete: boolean = false;
  fsbs = false;
  fsbsCod = 0;

  constructor(
    private fb: FormBuilder,
    private tipoEncuestaService: TipoEncuestaService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private appStore: Store<Appstate>,
    private authService: AuthService,
    private adminService: AdminService
  ) { }

  getCompanias(valor: any) {
    this.createTipoEncuestaForm.controls["codigo"]?.setValue(valor);
    this.compChecked = [];
    this.createTipoEncuestaForm.controls['companias']?.setValue(this.compChecked);
    this.allComplete = false;
    this.companiaLista.companias = [];
    let filter: any[] = [];
    filter = this.companias.filter(t => t.codigo == valor);
    filter.map(compania => {
      this.companiaLista.companias!.push({
        codigo_cia: compania.codigo_cia,
        completed: false
      })
    })
  }

  updateAllComplete() {
    this.allComplete = this.companiaLista.companias != null && this.companiaLista.companias.every(t => t.completed);
  }

  someComplete(): boolean {
    if (this.companiaLista.companias == null) {
      return false;
    }
    return this.companiaLista.companias.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.compChecked = [];
    this.createTipoEncuestaForm.controls['companias']?.setValue(this.compChecked);
    this.allComplete = completed;
    if (this.companiaLista.companias == null) {
      return;
    }
    this.companiaLista.companias.forEach(t => (t.completed = completed));
    if (completed) {
      this.companiaLista.companias.map(compania => {
        this.compChecked.push({
          codigo: this.createTipoEncuestaForm.value.codigo,
          codigo_cia: compania.codigo_cia
        });
      });
    } else {
      this.compChecked = [];
    }
    this.createTipoEncuestaForm.controls["companias"]?.setValue(this.compChecked);
  }

  setCompania(selected: boolean, valor: any) {
    if (selected) {
      this.compChecked.push({
        codigo: this.createTipoEncuestaForm.value.codigo,
        codigo_cia: valor
      });
    } else {
      const companiaSeleccionada = this.compChecked.findIndex((compania: any) => compania.codigo_cia == valor);
      this.compChecked.splice(companiaSeleccionada, 1);
    }
    this.createTipoEncuestaForm.controls["companias"]?.setValue(this.compChecked);
  }

  ngOnInit(): void {
    this.getIp();
    this.fsbs = this.authService.isFsbs();
    if (this.fsbs) {
      this.fsbsCod = 1;
    }
    this.store.pipe(select(currentUser)).subscribe(currentUser => {
      this.currentUser = currentUser;
      if (this.currentUser.fsbs != 1) {
        this.createTipoEncuestaForm.controls.codigo?.setValue(this.currentUser.codigo);
        this.createTipoEncuestaForm.controls.admins?.setValue(this.currentUser.codigo);
      } else {
        this.createTipoEncuestaForm.controls.codigo?.setValue("000");
      }
    })
    this.fsbs = this.authService.isFsbs();
    this.store.pipe(select(companias)).subscribe(companias => {
      this.store.dispatch(GET_COMPANIAS());
      this.companias = companias;
      let newArray: any[] = [];
      let newAdminCodigo: any[] = [];
      let filter: any[] = [];
      let filterCodAdmin: any[] = [];
      companias.map(compania => {
        newArray.push(compania.codigo_cia);
        newAdminCodigo.push(compania.codigo);
      })
      filter = [...new Set(newArray)];
      filter.map(compania => {
        this.compList.push({
          codigo_cia: compania,
          completed: false
        })
      })
      filterCodAdmin = [...new Set(newAdminCodigo)];
      filterCodAdmin.map(compania => {
        this.compAdminList.push({
          codigo: compania
        })
      })
    })
  };

  createTipoEncuestaForm = this.fb.group<TiposEncuesta>({
    codigo: ["000", [Validators.required]],
    companias: ["", Validators.required],
    admins: "",
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
    this.createTipoEncuestaForm.controls['admins']?.setValue("");
    try {
      this.store.dispatch(CREATE_TIPOS_ENCUESTA({newTipoEncuesta: {...this.createTipoEncuestaForm.value}}));
      if (this.createTipoEncuestaForm.value.companias) {
        let companies: [] | any;
        companies = this.createTipoEncuestaForm.value.companias;
        let date = new Date();
        date.setHours(date.getHours()-5);
        let createdAt =  new Date(date);
        for (let i = 0; i < companies.length-1; i++) {
          const element = {
            ...this.createTipoEncuestaForm.value,
            createdAt: createdAt,
            updatedAt: createdAt,
            createdIp: this.createTipoEncuestaForm.value.createdIp,
            updatedIp: this.createTipoEncuestaForm.value.createdIp,
            ...companies[i]
          };
          this.store.dispatch(CREATE_TIPOS_ENCUESTA_SUCCESS({newTipoEncuesta: element}))
        }
      }
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.tiposEncuestaState === "created" && data.loginStatus === "logged") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, tiposEncuestaState: "done" } }));
          this.toastr.success("Tipo de encuesta creada exitosamente.", "Tipo de Encuesta", {
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
