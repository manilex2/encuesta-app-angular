import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Appstate } from 'src/app/shared/store/AppState';
import { AdminService } from '../../services/admin.service';
import * as _ from 'lodash';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { UPDATE_ADMIN } from '../../store/actions/admin.actions';
import { switchMap } from 'rxjs';
import { selectAdminById } from '../../store/selectors/admin.selectors';

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
    codigo: ["", [Validators.required, Validators.pattern(/[0-9]{3}/g)]],
    nombre: ["", [Validators.required, Validators.maxLength(100)]],
    clave: ["", [Validators.required, Validators.maxLength(12)]],
    fsbs: [false, Validators.required],
    updatedIp: ['', Validators.required],
    logo: [null],
  });

  ngOnInit(): void {
    this.getIp();
    let fetchData$ = this.route.paramMap.pipe(
      switchMap((params) => {
        var codigo = String(params.get('codigo'));
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
      }
      else{
        this.router.navigate(['/admin/admins']);
      }
    });
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
    try {
      this.store.dispatch(UPDATE_ADMIN({updateAdmin: { ...this.updateAdminForm.value }}));
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.adminState === "updated") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, adminState: "done" } }));
          this.toastr.success("Admin actualizado exitosamente.", "Admin", {
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

}
