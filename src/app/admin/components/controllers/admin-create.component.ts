import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import * as _ from 'lodash';
import { Store, select } from '@ngrx/store';
import { CREATE_ADMIN, GET_ADMINS } from '../../store/actions/admin.actions';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Appstate } from '../../../shared/store/AppState';
import { selectAppState } from '../../../shared/store/selectors/app.selectors';
import { setAPIStatus } from '../../../shared/store/actions/app.actions';
import { Admin, Compania } from '../models';
import { companias } from '../../store/selectors/companias.selectors';
import { CREATE_COMPANIA_SUCCESS, GET_COMPANIAS } from '../../store/actions/companias.actions';
import { AuthService } from "../../../auth/services/auth.service"

export interface CompaniaLista {
  codigo?: string;
  codigo_cia?: string;
  completed?: boolean;
  companias?: CompaniaLista[];
  admins?: CompaniaLista[];
}

@Component({
  selector: 'app-admin-create',
  templateUrl: '../views/admin-create.component.html',
  styleUrls: ['../styles/admin-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminCreateComponent implements OnInit {

  @ViewChild('logoInput') logoInput!: ElementRef;

  hide = true;
  logoAtrib = 'Subir un logo';
  imageError: string | null | undefined;
  isImageSaved: boolean | undefined;
  cardImageBase64: string | undefined;
  companias: Compania[] = [];
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

  getCompanias(valor: any) {
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
    this.createAdminForm.controls['companias']?.setValue(this.compChecked);
    this.allComplete = completed;
    if (this.companiaLista.companias == null) {
      return;
    }
    this.companiaLista.companias.forEach(t => (t.completed = completed));
    if (completed) {
      this.companiaLista.companias.map(compania => {
        this.compChecked.push({
          codigo: this.createAdminForm.value.codigo,
          codigo_cia: compania.codigo_cia
        });
      });
    } else {
      this.compChecked = [];
    }
    this.createAdminForm.controls["companias"]?.setValue(this.compChecked);
  }

  setCompania(selected: boolean, valor: any) {
    if (selected) {
      this.compChecked.push({
        codigo: this.createAdminForm.value.codigo,
        codigo_cia: valor
      });
    } else {
      const companiaSeleccionada = this.compChecked.findIndex((compania: any) => compania.codigo_cia == valor);
      this.compChecked.splice(companiaSeleccionada, 1);
    }
    this.createAdminForm.controls["companias"]?.setValue(this.compChecked);
  }

  ngOnInit() {
    this.getIp();
    this.cantAdmin();
    this.fsbs = this.authService.isFsbs();
    if (!this.fsbs) {
      this.createAdminForm.controls["fsbs"]?.setValue(2);
    }
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
  }

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private appStore: Store<Appstate>,
    private authService: AuthService
  ) { }

  createAdminForm = this.fb.group<Admin>({
    codigo: ["000", Validators.required],
    nombre: ["", [Validators.required, Validators.maxLength(100)]],
    clave: ["", [Validators.required, Validators.maxLength(12)]],
    fsbs: [1, Validators.required],
    admins: "",
    companias: ["01", Validators.required],
    createdIp: ['', Validators.required],
    logo: [null],
  });

  requerido() {
    switch (this.createAdminForm.value.fsbs) {
      case 0:
        this.allComplete = false;
        this.companiaLista.companias!.forEach(t => (t.completed = false));
        this.compChecked = [];
        this.createAdminForm.controls['companias']?.setValue(this.compChecked);
        this.companiaLista.companias = this.compList;
        break;
      case 1:
        this.createAdminForm.controls["companias"]?.setValue("01");
        break;
      case 2:
        this.createAdminForm.controls['admins']?.setValue("")
        this.compChecked = [];
        this.allComplete = false;
        this.companiaLista.companias!.forEach(t => (t.completed = false));
        this.compChecked = [];
        this.createAdminForm.controls['companias']?.setValue(this.compChecked);
        this.companiaLista.companias = [];
        break;
      default:
        "01"
        break;
    }
  }

  cantAdmin() {
    return this.adminService.obtenerTodosAdmins().subscribe((admin) => {
      if (admin.length < 10) {
        this.createAdminForm.controls['codigo']?.setValue(`00${admin.length + 1}`);
      } else if (admin.length < 100) {
        this.createAdminForm.controls['codigo']?.setValue(`0${admin.length + 1}`);
      } else {
        this.createAdminForm.controls['codigo']?.setValue((admin.length + 1).toString());
      }
    });
  }

  onSubmit() {
    this.createAdminForm.controls['admins']?.setValue("");
    if (this.createAdminForm.value.fsbs == 1) {
      this.allComplete = false;
      this.companiaLista.companias!.forEach(t => (t.completed = false));
      this.compChecked = [];
      this.createAdminForm.controls['companias']?.setValue(this.compChecked);
    }
    try {
      this.store.dispatch(CREATE_ADMIN({newAdmin: {...this.createAdminForm.value}}));
      if (this.createAdminForm.value.companias) {
        let companies: [] | any;
        companies = this.createAdminForm.value.companias;
        let date = new Date();
        date.setHours(date.getHours()-5);
        let createdAt =  new Date(date);
        for (let i = 0; i < companies.length; i++) {
          const element = {
            createdAt: createdAt,
            updatedAt: createdAt,
            createdIp: this.createAdminForm.value.createdIp,
            updatedIp: this.createAdminForm.value.createdIp,
            ...companies[i]
          };
          this.store.dispatch(CREATE_COMPANIA_SUCCESS({newCompania: element}))
        }
      }

      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.loginStatus === "logged" && data.adminState === "created") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, adminState: "done" } }));
          this.toastr.success(`Admin creado exitosamente.<br/> Codigo de usuario: ${this.createAdminForm.value.codigo} <br/> Tome nota del código del usuario y haga clic en este mensaje`, "Admin", {
            disableTimeOut: true,
            enableHtml: true
          });
          this.router.navigate(['/admin/admins']);
        } else if (data.apiStatus === 'error' && data.loginStatus === "logged" && data.adminState === "createdError"){
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, adminState: "" } }));
          this.toastr.error(data.apiResponseMessage, "Admin", {
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

  getIp() {
    return this.adminService.getIPAddress().subscribe((res: any) => {
      this.createAdminForm.controls['createdIp']?.setValue(res.ip);
    })
  }

  uploadFileEvt(imgFile: any) {
    this.imageError = null;
    if (imgFile.target.files && imgFile.target.files[0]) {
      const max_size = 2097152;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 15200;
      const max_width = 25600;
      this.logoAtrib = '';
      Array.from(imgFile.target.files).forEach((file: any) => {
        this.logoAtrib = file.name;
      });
      if (imgFile.target.files[0].size > max_size) {
        this.imageError =
            'Tamaño maximo permitido es ' + Math.trunc(max_size / 1000000) + 'Mb';
        imgFile = null;
        this.logoAtrib = 'Subir un logo';
        this.toastr.error(this.imageError, "Imagen", {
          progressBar: true
        })
        return false;
      }

      if (!_.includes(allowed_types, imgFile.target.files[0].type)) {
          this.imageError = 'Solo imagenes son compatibles ( JPG | PNG )';
          imgFile = null;
          this.logoAtrib = 'Subir un logo';
          this.toastr.error(this.imageError, "Imagen", {
            progressBar: true
          })
          return false;
      }
      let reader = new FileReader();
      reader.onload = (e: any) => {
        const img_height = e.currentTarget['height'];
        const img_width = e.currentTarget['width'];
        if (img_height > max_height && img_width > max_width) {
          this.imageError =
              'Dimensiones maximas permitidas ' +
              max_height +
              '*' +
              max_width +
              'px';
            imgFile = null;
            this.logoAtrib = 'Subir un logo';
          return false;
        } else {
          let image = new Image();
          image.src = e.target.result;
          image.onload = (rs) => {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;
            this.createAdminForm.controls['logo']?.setValue(imgBase64Path);
          };
          return true;
        }
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      this.logoInput.nativeElement.value = '';
      return true;
    } else {
      this.logoAtrib = 'Subir un logo';
      return false;
    }
  }

}
