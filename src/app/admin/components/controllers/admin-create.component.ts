import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import * as _ from 'lodash';
import { Store, select } from '@ngrx/store';
import { CREATE_ADMIN } from '../../store/actions/admin.actions';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Appstate } from '../../../shared/store/AppState';
import { selectAppState } from '../../../shared/store/selectors/app.selectors';
import { setAPIStatus } from '../../../shared/store/actions/app.actions';

@Component({
  selector: 'app-admin-create',
  templateUrl: '../views/admin-create.component.html',
  styleUrls: ['../styles/admin-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateAdminComponent implements OnInit {

  @ViewChild('logoInput') logoInput!: ElementRef;

  hide = true;
  logoAtrib = 'Subir un logo';
  imageError: string | null | undefined;
  isImageSaved: boolean | undefined;
  cardImageBase64: string | undefined;

  ngOnInit() {
    this.getIp();
  }

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private store: Store,
    private router: Router,
    private toastr: ToastrService,
    private appStore: Store<Appstate>
  ) { }

  createAdminForm = this.fb.group({
    codigo: ["", [Validators.required, Validators.pattern(/[0-9]{3}/g)]],
    nombre: ["", [Validators.required]],
    clave: ["", Validators.required],
    fsbs: [false, Validators.required],
    createdIp: ['', Validators.required],
    logo: [null],
  });

  onSubmit() {
    try {
      this.store.dispatch(CREATE_ADMIN({newUser: {...this.createAdminForm.value}}));
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.adminState === "created") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, adminState: "done" } }));
          this.toastr.success("Admin creado exitosamente.", "Admin", {
            progressBar: true
          });
          this.router.navigate(['/admin/admins']);
        } else if (data.apiStatus === 'error'){
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200 } }));
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
