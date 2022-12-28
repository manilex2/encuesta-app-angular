import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Encuesta, TiposEncuesta } from '../models';
import { Store, select } from '@ngrx/store';
import { includes } from 'lodash';
import { DELETE_TIPOS_ENCUESTA, GET_TIPOS_ENCUESTA } from '../../store/actions/tiposencuesta.actions';
import { tipos_encuesta } from '../../store/selectors/tiposencuesta.selectors';
import { encuesta } from '../../store/selectors/encuesta.selectors';
import { Appstate } from 'src/app/shared/store/AppState';
import { ToastrService } from 'ngx-toastr';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TiposEncuestaDeleteDialogComponent } from './tipos-encuesta-delete-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatAccordion } from '@angular/material/expansion';
import { CREATE_ENCUESTA, DELETE_ENCUESTA, GET_ENCUESTA, UPDATE_ENCUESTA } from '../../store/actions/encuesta.actions';
import { FormBuilder, Validators } from '@angular/forms';
import { EncuestaService } from '../../services/encuesta.service';
import { EncuestaDeleteDialogComponent } from './encuesta-delete-dialog.component';

export interface Respuesta {
  resp?: any,
  img?: any,
  id?: any,
  pond?: any
}

@Component({
  selector: 'app-tipos-encuesta',
  templateUrl: '../views/tipos-encuesta-table.component.html',
  styleUrls: ['../styles/tipos-encuesta-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class TiposEncuestaTableComponent implements OnInit {
  columnsToDisplay: string[] = ['codigo', 'codigo_cia', 'identificador', 'descripcion', 'afectacion', 'createdIp', 'createdAt', 'updatedIp', 'updatedAt'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand', 'edit'];
  tiposencuesta: TiposEncuesta[] = [];
  dataSource: any;
  expandedElement: null | undefined;
  preguntas: Encuesta[] = [];
  respTemp: number = 1;
  newEncuesta: Encuesta[] = [];
  pruebaEncuesta: Respuesta[] = [];
  activarBoton: Boolean = true;
  activarBotonADD: Boolean = true;
  activarBotonDELETE: Boolean = true;
  logoAtrib = 'Imagen';
  imageError: string | null | undefined;
  isImageSaved: boolean | undefined;
  cardImageBase64 = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @ViewChild('logoInput') logoInput!: ElementRef;

  constructor(
    private store: Store,
    private appStore: Store<Appstate>,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private encuestaService: EncuestaService
  ) {}

  updateEncuestaForm = this.fb.group<Encuesta>({
    codigo: ["", [Validators.required]],
    codigo_cia: ["", Validators.required],
    identificador: ["", Validators.required],
    numero: ["", Validators.required],
    pregunta: ["", Validators.required],
    tipo_pregunta: ["", Validators.required],
    cantResp: ["", Validators.required],
    updatedIp: ["", Validators.required],
    respuestas: ""
  });

  createEncuestaForm = this.fb.group<Encuesta>({
    codigo: ["", [Validators.required]],
    codigo_cia: ["", Validators.required],
    identificador: ["", Validators.required],
    numero: ["", Validators.required],
    pregunta: ["Nueva Pregunta", Validators.required],
    tipo_pregunta: ["C", Validators.required],
    cantResp: [1, Validators.required],
    createdIp: ["", Validators.required],
    respuestas: "",
  });

  setRespuesta(event: any, encuestas: any, id: any) {
    if (event.value.length > 0) {
      this.activarBoton = true;
    } else {
      this.activarBoton = false;
    }
    if (this.pruebaEncuesta.length === 0) {
      this.pruebaEncuesta = encuestas.respuestas;
    }
    const resp = event.value;
    var respuestas: Respuesta[] = this.pruebaEncuesta;
    let filterData = respuestas.filter((_) => !(_.id == id));
    let pondData = respuestas.filter((_) => (_.id == id));
    filterData.push({
      resp,
      img: pondData[0].img,
      id,
      pond: pondData[0].pond
    });
    filterData.sort((a, b) => {
      if (a.id < b.id) return -1;
      else if (a.id > b.id) return 1;
      return 0;
    });
    this.pruebaEncuesta = filterData;
  }

  setPoderacion(event: any, encuestas: any, id: any) {
    if (event.value.length > 0) {
      this.activarBoton = true;
    } else {
      this.activarBoton = false;
    }
    if (this.pruebaEncuesta.length === 0) {
      this.pruebaEncuesta = encuestas.respuestas;
    }
    const pond = parseInt(event.value);
    var respuestas: Respuesta[] = this.pruebaEncuesta;
    let filterData = respuestas.filter((_) => !(_.id == id));
    let respData = respuestas.filter((_) => (_.id == id));
    filterData.push({
      resp: respData[0].resp,
      img: respData[0].img,
      id,
      pond
    });
    filterData.sort((a, b) => {
      if (a.id < b.id) return -1;
      else if (a.id > b.id) return 1;
      return 0;
    });
    this.pruebaEncuesta = filterData;
  }

  addResp(encuesta: any) {
    this.respTemp++;
    if (encuesta.cantResp < this.respTemp) {
      this.activarBoton = false;
    }
  }

  deleteResp(encuestas: any) {
    this.respTemp--;
    if (this.pruebaEncuesta.length === 0) {
      this.pruebaEncuesta = encuestas.respuestas;
    }
    this.activarBoton = true;
  }

  resetEncuesta(encuesta: any) {
    this.updateEncuestaForm.controls.codigo?.setValue(encuesta.codigo);
    this.updateEncuestaForm.controls.codigo_cia?.setValue(encuesta.codigo_cia);
    this.updateEncuestaForm.controls.identificador?.setValue(encuesta.identificador);
    this.updateEncuestaForm.controls.numero?.setValue(encuesta.numero);
    this.updateEncuestaForm.controls.pregunta?.setValue(encuesta.pregunta);
    this.updateEncuestaForm.controls.tipo_pregunta?.setValue(encuesta.tipo_pregunta);
    this.updateEncuestaForm.controls.cantResp?.setValue(encuesta.cantResp);
    this.updateEncuestaForm.controls.respuestas?.setValue(encuesta.respuestas);
    this.pruebaEncuesta = [];
  }

  get createPregunta() {return this.createEncuestaForm.controls.pregunta?.value }
  get createTipo_pregunta() {return this.createEncuestaForm.controls.tipo_pregunta?.value }
  get pregunta() {return this.updateEncuestaForm.controls.pregunta?.value }
  get tipo_pregunta() {return this.updateEncuestaForm.controls.tipo_pregunta?.value }
  get cantResp() {return this.updateEncuestaForm.controls.cantResp?.value }

  getIp() {
    return this.encuestaService.getIPAddress().subscribe((res: any) => {
      this.createEncuestaForm.controls.createdIp?.setValue(res.ip);
      this.updateEncuestaForm.controls.updatedIp?.setValue(res.ip);
    })
  };

  ngOnInit(): void {
    this.getIp();
    this.store.pipe(select(encuesta)).subscribe(encuesta => {
      this.store.dispatch(GET_ENCUESTA());
      this.preguntas = encuesta;
    })
    setTimeout(()=> {
      this.store.pipe(select(tipos_encuesta)).subscribe(tiposencuesta => {
        this.store.dispatch(GET_TIPOS_ENCUESTA());
        for (let i = 0; i < tiposencuesta.length; i++) {
          const element = tiposencuesta[i];
          let filteredData = this.preguntas.filter((_) => _.codigo === element.codigo && _.codigo_cia === element.codigo_cia && _.identificador === element.identificador)
          this.tiposencuesta.push({
            ...element,
            encuestas: filteredData
          })
        }
        this.dataSource = new MatTableDataSource<TiposEncuesta>(this.tiposencuesta);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        let apiStatus$ = this.appStore.pipe(select(selectAppState));
        apiStatus$.subscribe((data) => {
          if (data.apiStatus === "success" && data.tiposEncuestaState === "getted" && data.loginStatus === "logged") {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, tiposEncuestaState: "done" } }));
            this.toastr.success("Tipos de encuesta recuperados con exito.", "Tipos de Encuesta", {
              progressBar: true
            })
          } else if (data.apiStatus === "error" && data.tiposEncuestaState === "gettedError" && data.loginStatus === "logged") {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, tiposEncuestaState: "" } }));
            this.toastr.error(data.apiResponseMessage, "Tipos de Encuesta", {
              progressBar: true
            })
          }
        })
      });
    }, 400)
  };

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, tipos_encuesta: any): void {
    const dialogRef = this.dialog.open(TiposEncuestaDeleteDialogComponent, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: tipos_encuesta
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTipoEncuesta(result.codigo, result.codigo_cia, result.identificador);
      }
    });
  }

  openDialogCreate(): void {
    if (this.pruebaEncuesta.length > 0) {
      let cantResp = 0;
      let respuestasFinales = [];
      for (let i = 1; i <= this.pruebaEncuesta.length; i++) {
        const element = this.pruebaEncuesta[i-1];
        if (this.respTemp < i) {
          respuestasFinales.push({
            resp: "",
            img: null,
            id: element.id
          })
          continue
        }
        cantResp++;
        respuestasFinales.push(element);
      }
      this.createEncuestaForm.controls.cantResp?.setValue(cantResp);
      this.createEncuestaForm.controls.respuestas?.setValue(respuestasFinales);
    }
    if (this.createEncuestaForm.value.tipo_pregunta == "A") {
      let abierta = [];
      for (let i = 0; i < 5; i++) {
        var element;
        switch (i) {
          case 0:
            element = "A";
            break;
          case 1:
            element = "B";
            break;
          case 2:
            element = "C";
            break;
          case 3:
            element = "D";
            break;
          case 4:
            element = "E";
            break;

          default:
            break;
        }
        abierta.push({
          resp: "",
          img: null,
          id: element
        })
      }
      this.createEncuestaForm.controls.respuestas?.setValue(abierta);
      this.createEncuestaForm.controls.cantResp?.setValue(1);
    }
    try {
      this.store.dispatch(CREATE_ENCUESTA({newEncuesta: {...this.createEncuestaForm.value}}));
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.encuestaState === "created" && data.loginStatus === "logged") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, encuestaState: "done" } }));
          this.toastr.success("Encuesta creada exitosamente.", "Encuesta", {
            progressBar: true
          });
          this.router.navigateByUrl('/admin', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/admin/tipos_encuesta']);
          });
        } else if (data.apiStatus === 'error' && data.encuestaState === "createdError" && data.loginStatus === "logged"){
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, encuestaState: "" } }));
          this.toastr.error(data.apiResponseMessage, "Encuesta", {
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

  eliminarEncuestaDialog(enterAnimationDuration: string, exitAnimationDuration: string, encuesta: any): void {
    const dialogRef = this.dialog.open(EncuestaDeleteDialogComponent, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: encuesta
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteEncuesta(result.codigo, result.codigo_cia, result.identificador, result.numero);
      }
    });
  }

  deleteTipoEncuesta(codigo: string, codigo_cia: string, identificador: string) {
    try {
      this.store.dispatch(DELETE_TIPOS_ENCUESTA({ codigo, codigo_cia, identificador }));
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.tiposEncuestaState === "deleted" && data.loginStatus === "logged") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, tiposEncuestaState: "done" } }));
          this.toastr.success("Tipo de encuesta eliminada exitosamente.", "Tipos de Encuesta", {
            progressBar: true
          });
          this.router.navigateByUrl('/admin', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/admin/tipos_encuesta']);
          });
        } else if (data.apiStatus === 'error' && data.loginStatus === "logged" && data.tiposEncuestaState === "deletedError"){
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, tiposEncuestaState: "" } }));
          this.toastr.error(data.apiResponseMessage, "Tipos de Encuesta", {
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

  deleteEncuesta(codigo: string, codigo_cia: string, identificador: string, numero: number) {
    try {
      this.store.dispatch(DELETE_ENCUESTA({ codigo, codigo_cia, identificador, numero }));
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.encuestaState === "deleted" && data.loginStatus === "logged") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, encuestaState: "done" } }));
          this.toastr.success("Encuesta eliminada exitosamente.", "Encuesta", {
            progressBar: true
          });
          this.router.navigateByUrl('/admin', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/admin/tipos_encuesta']);
          });
        } else if (data.apiStatus === 'error' && data.loginStatus === "logged" && data.encuestaState === "deletedError"){
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, encuestaState: "" } }));
          this.toastr.error(data.apiResponseMessage, "Encuesta", {
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

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  reiniciar() {
    this.router.navigateByUrl('/admin', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin/tipos_encuesta']);
    });
  }

  actualizar(encuestas: any) {
    if (encuestas.saved) {
      this.updateEncuestaForm.controls.tipo_pregunta?.setValue(encuestas.tipo_pregunta);
      this.updateEncuestaForm.controls.codigo?.setValue(encuestas.codigo);
      this.updateEncuestaForm.controls.codigo_cia?.setValue(encuestas.codigo_cia);
      this.updateEncuestaForm.controls.identificador?.setValue(encuestas.identificador);
      this.updateEncuestaForm.controls.numero?.setValue(encuestas.numero);
      this.updateEncuestaForm.controls.pregunta?.setValue(encuestas.pregunta);
      this.getIp();
    }
    if (this.pruebaEncuesta.length > 0) {
      let cantResp = 0;
      let respuestasFinales = [];
      for (let i = 1; i <= this.pruebaEncuesta.length; i++) {
        const element = this.pruebaEncuesta[i-1];
        if (this.respTemp < i) {
          respuestasFinales.push({
            resp: "",
            img: null,
            id: element.id
          })
          continue
        }
        cantResp++;
        respuestasFinales.push(element);
      }
      this.updateEncuestaForm.controls.cantResp?.setValue(cantResp);
      this.updateEncuestaForm.controls.respuestas?.setValue(respuestasFinales);
    }
    if (this.updateEncuestaForm.value.tipo_pregunta == "A") {
      let abierta = [];
      for (let i = 0; i < 5; i++) {
        var element;
        switch (i) {
          case 0:
            element = "A";
            break;
          case 1:
            element = "B";
            break;
          case 2:
            element = "C";
            break;
          case 3:
            element = "D";
            break;
          case 4:
            element = "E";
            break;

          default:
            break;
        }
        abierta.push({
          resp: "",
          img: null,
          id: element,
          pond: 0
        })
      }
      this.updateEncuestaForm.controls.respuestas?.setValue(abierta);
      this.updateEncuestaForm.controls.cantResp?.setValue(1);
    }
    try {
      this.store.dispatch(UPDATE_ENCUESTA({updateEncuesta: { ...this.updateEncuestaForm.value }, codigo: encuestas.codigo, codigo_cia: encuestas.codigo_cia, identificador: encuestas.identificador, numero: encuestas.numero}));
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.loginStatus === "logged" && data.encuestaState === "updated") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, encuestaState: "done" } }));
          this.toastr.success("Encuesta actualizada exitosamente.", "Encuesta", {
            progressBar: true
          });
          this.router.navigateByUrl('/admin', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/admin/tipos_encuesta']);
          });
        } else if (data.apiStatus === 'error' && data.loginStatus === "logged" && data.encuestaState === "updatedError"){
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, encuestaState: "" } }));
          this.toastr.error(data.apiResponseMessage, "Encuesta", {
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

  changeCantRespHandler(event: any) {
    this.respTemp = event.target.value;
  }

  agregarEncuesta(encuestas: any) {
    this.activarBotonADD = false;
    this.activarBotonDELETE = false;
    let numero;
    if (encuestas.encuestas.length > 0) {
      let nEncuesta = encuestas.encuestas[encuestas.encuestas.length - 1].numero;
      if (this.newEncuesta.length == 0) {
        numero = nEncuesta + 1;
      } else {
        numero = nEncuesta + this.newEncuesta.length + 1;
      }
    } else if (this.newEncuesta.length <= 0) {
      numero = 1;
    } else {
      numero = this.newEncuesta.length + 1;
    }
    if (encuestas.encuestas.length > 0) {
      this.newEncuesta.push({
        saved: false,
        codigo: encuestas.encuestas[0].codigo,
        codigo_cia: encuestas.encuestas[0].codigo_cia,
        identificador: encuestas.encuestas[0].identificador,
        numero,
        pregunta: "Nueva Pregunta",
        tipo_pregunta: "C",
        cantResp: 1,
        respuestas: [{
          resp: "Respuesta",
          img: null,
          id: "A",
          pond: 0
        }, {
          resp: "",
          img: null,
          id: "B",
          pond: 0
        }, {
          resp: "",
          img: null,
          id: "C",
          pond: 0
        }, {
          resp: "",
          img: null,
          id: "D",
          pond: 0
        }, {
          resp: "",
          img: null,
          id: "E",
          pond: 0
        }]
      })
      this.createEncuestaForm.controls.codigo?.setValue(encuestas.encuestas[0].codigo);
      this.createEncuestaForm.controls.codigo_cia?.setValue(encuestas.encuestas[0].codigo_cia);
      this.createEncuestaForm.controls.identificador?.setValue(encuestas.encuestas[0].identificador);
      this.createEncuestaForm.controls.numero?.setValue(numero);
      this.pruebaEncuesta = this.newEncuesta[0].respuestas;
      this.createEncuestaForm.controls.respuestas?.setValue(this.pruebaEncuesta);
    } else {
      this.newEncuesta.push({
        saved: false,
        codigo: encuestas.codigo,
        codigo_cia: encuestas.codigo_cia,
        identificador: encuestas.identificador,
        numero,
        pregunta: "Nueva Pregunta",
        tipo_pregunta: "C",
        cantResp: 1,
        respuestas: [{
          resp: "Respuesta",
          img: null,
          id: "A",
          pond: 0
        }, {
          resp: "",
          img: null,
          id: "B",
          pond: 0
        }, {
          resp: "",
          img: null,
          id: "C",
          pond: 0
        }, {
          resp: "",
          img: null,
          id: "D",
          pond: 0
        }, {
          resp: "",
          img: null,
          id: "E",
          pond: 0
        }]
      })
      this.createEncuestaForm.controls.codigo?.setValue(encuestas.codigo);
      this.createEncuestaForm.controls.codigo_cia?.setValue(encuestas.codigo_cia);
      this.createEncuestaForm.controls.identificador?.setValue(encuestas.identificador);
      this.createEncuestaForm.controls.numero?.setValue(numero);
      this.pruebaEncuesta = this.newEncuesta[0].respuestas;
      this.createEncuestaForm.controls.respuestas?.setValue(this.pruebaEncuesta);
      this.createEncuestaForm.controls.cantResp?.setValue(1);
    }
  }

  uploadFileEvt(event: any, encuestas: any, id: any, indice: number) {
    this.imageError = null;
    if (event.target.files && event.target.files[0]) {
      const max_size = 35840;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 420;
      const max_width = 420;
      this.logoAtrib = '';
      Array.from(event.target.files).forEach((file: any) => {
        this.logoAtrib = file.name;
      });
      if (event.target.files[0].size > max_size) {
        this.imageError =
            'Tamaño maximo permitido es ' + Math.trunc(max_size / 1024) + 'kb';
        event = null;
        this.logoAtrib = 'Subir un logo';
        this.toastr.error(this.imageError, "Imagen", {
          progressBar: true
        })
        return false;
      }

      if (includes(allowed_types, event.target.files[0].type)) {
          this.imageError = 'Solo imagenes son compatibles ( JPG | PNG )';
          event = null;
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
            event = null;
            this.logoAtrib = 'Subir un logo';
          return false;
        } else {
          let image = new Image();
          image.src = e.target.result;
          image.onload = (rs) => {
            const imgBase64Path = e.target.result;
            this.cardImageBase64[indice] = imgBase64Path;
            if (this.pruebaEncuesta.length === 0) {
              this.pruebaEncuesta = encuestas.respuestas;
            }
            const img: Blob = imgBase64Path;
            var respuestas: Respuesta[] = this.pruebaEncuesta;
            let filterData = respuestas.filter((_) => !(_.id == id));
            let imgdData = respuestas.filter((_) => (_.id == id));
            filterData.push({
              resp: imgdData[0].resp,
              img: img,
              id,
              pond: imgdData[0].pond
            });
            filterData.sort((a, b) => {
              if (a.id < b.id) return -1;
              else if (a.id > b.id) return 1;
              return 0;
            });
            this.pruebaEncuesta = filterData;
          };
          return true;
        }
      };
      reader.readAsDataURL(event.target.files[0]);
      this.logoInput.nativeElement.value = '';
      return true;
    } else {
      this.logoAtrib = 'Subir un logo';
      return false;
    }
  }
}
