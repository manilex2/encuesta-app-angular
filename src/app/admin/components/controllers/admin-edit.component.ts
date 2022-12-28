import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Appstate } from 'src/app/shared/store/AppState';
import { AdminService } from '../../services/admin.service';
import { includes } from 'lodash';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { UPDATE_ADMIN } from '../../store/actions/admin.actions';
import { switchMap } from 'rxjs';
import { selectAdminById } from '../../store/selectors/admin.selectors';
import { Compania } from '../models';
import { CREATE_COMPANIA_SUCCESS, DELETE_COMPANIA_X_CODIGO_SUCCESS, GET_COMPANIAS } from '../../store/actions/companias.actions';
import { companias } from '../../store/selectors/companias.selectors';
import { currentUser } from '../../store/selectors/currentuser.selectors';

export interface CompaniaLista {
  codigo?: string | null;
  codigo_cia?: string;
  completed?: boolean;
  companias?: CompaniaLista[];
  admins?: CompaniaLista[];
}

@Component({
  selector: 'app-edit-admin',
  templateUrl: '../views/admin-edit.component.html',
  styleUrls: ['../styles/admin-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminEditComponent implements OnInit {

  @ViewChild('logoInput') logoInput!: ElementRef;

  hide = true;
  logoAtrib = 'Subir un logo';
  imageError: string | null | undefined;
  isImageSaved: boolean | undefined;
  cardImageBase64: string | undefined;
  routeParams: any;
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
  filterChecked: any[] = [];
  arraySelected: any;
  arrayOptions: any = [];
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private appStore: Store<Appstate>
  ) { }

  updateAdminForm = this.fb.group({
    codigo: "",
    nombre: ["", [Validators.required, Validators.maxLength(100)]],
    clave: ["", [Validators.required, Validators.maxLength(12)]],
    fsbs: [1, Validators.required],
    admins: "",
    companias: ["01"],
    updatedIp: ['', Validators.required],
    logo: [null],
  });

  requerido() {
    this.companiaLista.companias = this.compList;
    switch (this.updateAdminForm.value.fsbs) {
      case 0:
        this.compChecked = [];
        this.filterChecked = this.companias.filter((compania: any) => compania.codigo == this.updateAdminForm.value.codigo);
        this.arraySelected = this.companiaLista.companias?.map((compania) => {
          let filterComp = this.filterChecked.find((comp: any) => comp.codigo_cia == compania.codigo_cia);
          if (filterComp) {
            this.updateAdminForm.controls["companias"]?.setValue(filterComp);
            let result = { ...filterComp, completed: true }
            return result;
          }
          return compania;
        })
        if (this.arraySelected.length > 0) {
          this.arraySelected.map((comp: any) => {
            this.setCompaniaInit(comp.completed, comp.codigo_cia);
          })
          this.companiaLista.companias = this.arraySelected;
          this.allComplete = this.companiaLista.companias != null && this.companiaLista.companias.every(t => t.completed);
          this.someComplete();
        }
        break;
      case 1:
        this.updateAdminForm.controls["companias"]?.setValue("01");
        break;
      case 2:
        this.updateAdminForm.controls['admins']?.setValue("");
        this.compChecked = [];
        this.allComplete = false;
        this.companiaLista.companias!.forEach(t => (t.completed = false));
        this.compChecked = [];
        this.updateAdminForm.controls['companias']?.setValue(this.compChecked);
        this.companiaLista.companias = [];
        break;
      default:
        "00"
        break;
    }
  }

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
    this.updateAdminForm.controls['companias']?.setValue(this.compChecked);
    this.allComplete = completed;
    if (this.companiaLista.companias == null) {
      return;
    }
    this.companiaLista.companias.forEach(t => (t.completed = completed));
    if (completed) {
      this.companiaLista.companias.map(compania => {
        this.compChecked.push({
          codigo: this.updateAdminForm.value.codigo,
          codigo_cia: compania.codigo_cia
        });
      });
    } else {
      this.compChecked = [];
    }
    this.updateAdminForm.controls["companias"]?.setValue(this.compChecked);
  }

  setCompania(selected: boolean, valor: any) {
    if (selected) {
      this.compChecked.push({
        codigo: this.updateAdminForm.value.codigo,
        codigo_cia: valor
      });
    } else {
      const companiaSeleccionada = this.compChecked.findIndex((compania: any) => compania.codigo_cia == valor);
      this.compChecked.splice(companiaSeleccionada, 1);
    }
  }

  setCompaniaInit(selected: boolean, valor: any) {
    if (selected) {
      this.compChecked.push({
        codigo: this.updateAdminForm.value.codigo,
        codigo_cia: valor
      });
    }
    this.updateAdminForm.controls["companias"]?.setValue(this.compChecked);
  }

  ngOnInit(): void {
    this.getIp();
    this.store.pipe(select(currentUser)).subscribe(currentUser => {
      this.currentUser = currentUser;
    });
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
      let fetchData$ = this.route.paramMap.pipe(
        switchMap((params) => {
          let codigo = String(params.get('codigo'));
          return this.store.pipe(select(selectAdminById(codigo)));
        })
      );
      fetchData$.subscribe((data) => {
        if (data) {
          this.updateAdminForm.controls.codigo.setValue(data.codigo);
          this.updateAdminForm.controls.nombre.setValue(data.nombre);
          this.updateAdminForm.controls.clave.setValue(data.clave);
          this.updateAdminForm.controls.logo.setValue(data.logo);
          this.updateAdminForm.controls.fsbs.setValue(data.fsbs);
          if (this.updateAdminForm.value.logo != null) {
            this.isImageSaved = true;
            this.cardImageBase64 = this.updateAdminForm.value.logo;
          }
          this.filterChecked = this.companias.filter((compania: any) => compania.codigo == data.codigo);
          this.arraySelected = this.companiaLista.companias?.map((compania) => {
            let filterComp = this.filterChecked.find((comp: any) => comp.codigo_cia == compania.codigo_cia);
            if (filterComp) {
             this.arrayOptions.push(filterComp);
              let result = { ...filterComp, completed: true }
              return result;
            }
            return compania;
          })
          if (this.arraySelected.length > 0) {
            this.compChecked = [];
            this.arraySelected.map((comp: any) => {
              this.setCompaniaInit(comp.completed, comp.codigo_cia);
            })
            this.companiaLista.companias = this.arraySelected;
            this.allComplete = this.companiaLista.companias != null && this.companiaLista.companias.every(t => t.completed);
            this.someComplete();
            this.updateAdminForm.controls["companias"]?.setValue(this.compChecked);
          }
          this.routeParams = {
            codigo: data.codigo
          }
        }
        else{
          this.router.navigate(['/admin/admins']);
        }
      });
    })
  }

  getIp() {
    return this.adminService.getIPAddress().subscribe((res: any) => {
      this.updateAdminForm.controls.updatedIp.setValue(res.ip);
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

      if (includes(allowed_types, imgFile.target.files[0].type)) {
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
            this.updateAdminForm.controls['logo']?.setValue(imgBase64Path);
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

  onUpdate() {
    this.updateAdminForm.controls['admins']?.setValue("");
    if (this.updateAdminForm.value.fsbs == 1) {
      this.allComplete = false;
      this.companiaLista.companias!.forEach(t => (t.completed = false));
      this.compChecked = [];
      this.updateAdminForm.controls['companias']?.setValue(this.compChecked);
    }
    console.log(this.updateAdminForm.value);
    try {
      this.store.dispatch(UPDATE_ADMIN({updateAdmin: { ...this.updateAdminForm.value }, codigo: this.routeParams.codigo}));
      if (this.updateAdminForm.value.companias?.length! > 0) {
        let companies: [] | any;
        companies = this.updateAdminForm.value.companias;
        let date = new Date();
        date.setHours(date.getHours()-5);
        let updatedAt =  new Date(date);
        for (let i = 0; i < companies.length; i++) {
          const element = companies[i];
          this.store.dispatch(DELETE_COMPANIA_X_CODIGO_SUCCESS({ deleteCodCompania: element }))
        }
        for (let i = 0; i < companies.length; i++) {
          const element = {
            createdAt: updatedAt,
            updatedAt: updatedAt,
            createdIp: this.updateAdminForm.value.updatedIp,
            updatedIp: this.updateAdminForm.value.updatedIp,
            ...companies[i]
          };
          this.store.dispatch(CREATE_COMPANIA_SUCCESS({ newCompania: element }))
        }
      } else {
        let companies: [] | any;
        companies = {codigo: this.updateAdminForm.value.codigo};
        this.store.dispatch(DELETE_COMPANIA_X_CODIGO_SUCCESS({ deleteCodCompania: companies }))
      }
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.loginStatus === "logged" && data.adminState === "updated") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, adminState: "done" } }));
          this.toastr.success("Admin actualizado exitosamente.", "Admin", {
            progressBar: true
          });
          this.router.navigate(['/admin/admins']);
        } else if (data.apiStatus === 'error' && data.loginStatus === "logged" && data.adminState === "updatedError"){
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

}
