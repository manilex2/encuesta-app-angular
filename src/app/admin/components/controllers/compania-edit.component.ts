import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Appstate } from 'src/app/shared/store/AppState';
import { CompaniaService } from '../../services/compania.service';
import { includes } from 'lodash';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { UPDATE_COMPANIA } from '../../store/actions/companias.actions';
import { map, Observable, switchMap } from 'rxjs';
import { selectCompaniaById } from '../../store/selectors/companias.selectors';
import { StepperOrientation } from '@angular/material/stepper';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { currentUser } from '../../store/selectors/currentuser.selectors';

@Component({
  selector: 'app-compania-edit',
  templateUrl: '../views/compania-edit.component.html',
  styleUrls: ['../styles/compania-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {
        displayDefaultIndicatorType: false
      },
    },
  ],
})
export class CompaniaEditComponent implements OnInit {

  @ViewChild('logoInput') logoInput!: ElementRef;

  hideEmail = true;
  hideOrigen = true;
  logoAtrib = 'Subir un logo';
  imageError: string | null | undefined;
  isImageSaved: boolean | undefined;
  cardImageBase64: string | undefined;
  stepperOrientation: Observable<StepperOrientation>;
  currentUser: any;
  routeParams: any;

  constructor(
    private fb: FormBuilder,
    private companiaService: CompaniaService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private appStore: Store<Appstate>,
    private breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 960px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  updateCompaniaForm: any;

  basicCompaniaForm = this.fb.group({
    codigo: ["", [Validators.required, Validators.pattern(/[0-9]{3}/g)]],
    codigo_cia: ["", [Validators.required, Validators.pattern(/[0-9]{2}/g)]],
    logo: [null],
    vista_lista: [null],
    updatedIp: ["", Validators.required],
  });

  origenCompaniaForm = this.fb.group({
    origen_clave: ["", [Validators.required, Validators.maxLength(12)]],
    origen_dato: ["", [Validators.required, Validators.maxLength(100)]],
    origen_name_DB: ["", [Validators.required, Validators.maxLength(50)]],
    origen_puerto: ["", [Validators.required, Validators.maxLength(50)]],
    origen_user: ["", [Validators.required, Validators.maxLength(20)]]
  });

  emailCompaniaForm = this.fb.group({
    email_clave: ["", [Validators.required, Validators.maxLength(100)]],
    email_mensaje: ["", [Validators.required, Validators.maxLength(100)]],
    email_office_365: [true],
    email_puerto: ["", [Validators.required, Validators.maxLength(100)]],
    email_salida: ["", [Validators.required, Validators.email, Validators.maxLength(100)]],
    email_smtp: ["", [Validators.required, Validators.maxLength(100)]],
    email_tema: ["", [Validators.required, Validators.maxLength(100)]]
  });

  ngOnInit(): void {
    this.store.pipe(select(currentUser)).subscribe(currentUser => {
      this.currentUser = currentUser;
    })
    this.getIp();
    let fetchData$ = this.route.paramMap.pipe(
      switchMap((params) => {
        var codigo = String(params.get('codigo'));
        var compania = String(params.get('compania'));
        return this.store.pipe(select(selectCompaniaById(codigo, compania)));
      })
    );
    fetchData$.subscribe((data) => {
      if (data) {
        this.basicCompaniaForm.controls.codigo.setValue(data.codigo);
        this.basicCompaniaForm.controls.codigo_cia.setValue(data.codigo_cia);
        this.basicCompaniaForm.controls.vista_lista.setValue(data.vista_lista);
        this.basicCompaniaForm.controls.logo.setValue(data.logo);
        if (this.basicCompaniaForm.value.logo != null) {
          this.isImageSaved = true;
          this.cardImageBase64 = this.basicCompaniaForm.value.logo;
        }
        this.origenCompaniaForm.controls.origen_clave.setValue(data.origen_clave);
        this.origenCompaniaForm.controls.origen_dato.setValue(data.origen_dato);
        this.origenCompaniaForm.controls.origen_name_DB.setValue(data.origen_name_DB);
        this.origenCompaniaForm.controls.origen_puerto.setValue(data.origen_puerto);
        this.origenCompaniaForm.controls.origen_user.setValue(data.origen_user);
        this.emailCompaniaForm.controls.email_clave.setValue(data.email_clave);
        this.emailCompaniaForm.controls.email_mensaje.setValue(data.email_mensaje);
        this.emailCompaniaForm.controls.email_office_365.setValue(data.email_office_365);
        this.emailCompaniaForm.controls.email_puerto.setValue(data.email_puerto);
        this.emailCompaniaForm.controls.email_salida.setValue(data.email_salida);
        this.emailCompaniaForm.controls.email_smtp.setValue(data.email_smtp);
        this.emailCompaniaForm.controls.email_tema.setValue(data.email_tema);
        this.routeParams = {
          codigo: data.codigo,
          codigo_cia: data.codigo_cia
        }
      }
      else{
        this.router.navigate(['/admin/companias']);
      }
    });
  }

  getIp() {
    return this.companiaService.getIPAddress().subscribe((res: any) => {
      this.basicCompaniaForm.controls.updatedIp.setValue(res.ip);
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
            this.basicCompaniaForm.controls.logo.setValue(imgBase64Path);
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
    try {
      this.updateCompaniaForm = {
        ...this.basicCompaniaForm.value,
        ...this.emailCompaniaForm.value,
        ...this.origenCompaniaForm.value
      }
      this.store.dispatch(UPDATE_COMPANIA({updateCompania: { ...this.updateCompaniaForm }, codigo: this.routeParams.codigo, codigo_cia: this.routeParams.codigo_cia}));
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.companiaState === "updated" && data.loginStatus === "logged") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, companiaState: "done" } }));
          this.toastr.success("Compañía actualizada exitosamente.", "Compañía", {
            progressBar: true
          });
          this.router.navigate(['/admin/companias']);
        } else if (data.apiStatus === 'error' && data.companiaState === "updatedError" && data.loginStatus === "logged"){
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, companiaState: "" } }));
          this.toastr.error(data.apiResponseMessage, "Compañía", {
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
