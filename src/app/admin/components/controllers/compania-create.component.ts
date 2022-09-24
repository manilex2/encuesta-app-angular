import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { StepperOrientation } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { map, Observable } from 'rxjs';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { Appstate } from 'src/app/shared/store/AppState';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { CompaniaService } from '../../services/compania.service';
import { CREATE_COMPANIA } from '../../store/actions/companias.actions';
import { Compania } from '../models';

@Component({
  selector: 'app-compania-create',
  templateUrl: '../views/compania-create.component.html',
  styleUrls: ['../styles/compania-create.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {
        displayDefaultIndicatorType: false
      },
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CompaniaCreateComponent implements OnInit {

  @ViewChild('logoInput') logoInput!: ElementRef;

  hideEmail = true;
  hideOrigen = true;
  logoAtrib = 'Subir un logo';
  imageError: string | null | undefined;
  isImageSaved: boolean | undefined;
  cardImageBase64: string | undefined;
  stepperOrientation: Observable<StepperOrientation>;

  constructor(
    private fb: FormBuilder,
    private companiaService: CompaniaService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private appStore: Store<Appstate>,
    private breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 960px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.getIp();
  }

  createCompaniaForm: any;

  basicCompaniaForm = this.fb.group<Compania>({
    codigo: ["", [Validators.required, Validators.pattern(/[0-9]{3}/g)]],
    codigo_cia: ["", [Validators.required, Validators.pattern(/[0-9]{2}/g)]],
    logo: [null],
    vista_lista: [null],
    createdIp: ["", Validators.required],
  });

  origenCompaniaForm = this.fb.group<Compania>({
    origen_clave: ["", [Validators.required, Validators.maxLength(12)]],
    origen_dato: ["", [Validators.required, Validators.maxLength(100)]],
    origen_name_DB: ["", [Validators.required, Validators.maxLength(50)]],
    origen_puerto: ["", [Validators.required, Validators.maxLength(50)]],
    origen_user: ["", [Validators.required, Validators.maxLength(20)]]
  });

  emailCompaniaForm = this.fb.group<Compania>({
    email_clave: ["", [Validators.required, Validators.maxLength(100)]],
    email_mensaje: ["", [Validators.required, Validators.maxLength(100)]],
    email_office_365: [true],
    email_puerto: ["", [Validators.required, Validators.maxLength(100)]],
    email_salida: ["", [Validators.required, Validators.email, Validators.maxLength(100)]],
    email_smtp: ["", [Validators.required, Validators.maxLength(100)]],
    email_tema: ["", [Validators.required, Validators.maxLength(100)]]
  });

  onSubmit() {
    try {
      this.createCompaniaForm = {
        ...this.basicCompaniaForm.value,
        ...this.emailCompaniaForm.value,
        ...this.origenCompaniaForm.value
      }
      this.store.dispatch(CREATE_COMPANIA({newCompania: {...this.createCompaniaForm}}));
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.companiaState === "created") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, companiaState: "done" } }));
          this.toastr.success("Compañía creada exitosamente.", "Compañía", {
            progressBar: true
          });
          this.router.navigate(['/admin/companias']);
        } else if (data.apiStatus === 'error'){
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200 } }));
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

  getIp() {
    return this.companiaService.getIPAddress().subscribe((res: any) => {
      this.basicCompaniaForm.controls['createdIp']?.setValue(res.ip);
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
            this.basicCompaniaForm.controls['logo']?.setValue(imgBase64Path);
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
