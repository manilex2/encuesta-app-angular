import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort } from '@angular/material/sort';
import { Compania } from '../models/Compania';
import { select, Store } from '@ngrx/store';
import { companias } from '../../store/selectors/companias.selectors';
import { GET_COMPANIAS, DELETE_COMPANIA } from '../../store/actions/companias.actions';
import { Appstate } from 'src/app/shared/store/AppState';
import { ToastrService } from 'ngx-toastr';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CompaniaDeleteDialogComponent } from '../controllers/compania-delete-dialog.component';
import { Observable } from 'rxjs';
import { tipos_encuesta } from '../../store/selectors/tiposencuesta.selectors';
import { DELETE_TIPOS_ENCUESTA_SUCCESS } from '../../store/actions/tiposencuesta.actions';

@Component({
  selector: 'app-companias',
  templateUrl: '../views/companias-table.component.html',
  styleUrls: ['../styles/companias-table.component.scss']
})
export class CompaniasTableComponent implements OnInit {
  columnas: string[] = [ 'codigo', 'codigo_cia', 'origen_dato', 'origen_puerto', 'origen_name_DB', 'origen_user', 'origen_clave', 'email_smtp', 'email_puerto', 'email_salida', 'email_clave', 'email_tema', 'email_mensaje', 'email_office_365', 'createdIp', 'createdAt', 'updatedIp', 'updatedAt', 'logo', 'vista_lista', 'edit'];
  companias: Compania[] = [];
  dataSource: any;
  data$: Observable<any> = this.store.pipe(select(companias));
  tipos_encuesta: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private store: Store,
    private appStore: Store<Appstate>,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.pipe(select(companias)).subscribe(compania => {
      this.store.dispatch(GET_COMPANIAS());
      this.companias = compania;
      this.dataSource = new MatTableDataSource<Compania>(this.companias);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.appStore.pipe(select(selectAppState)).subscribe((data) => {
        if (data.apiStatus === "success" && data.companiaState === "getted" && data.loginStatus === "logged") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, companiaState: "done" } }));
          this.toastr.success("Compañías recuperadas con exito.", "Compañías", {
            progressBar: true
          })
        } else if (data.apiStatus === "error" && data.companiaState === "gettedError" && data.loginStatus === "logged") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, companiaState: "" } }));
          this.toastr.error(data.apiResponseMessage, "Compañías", {
            progressBar: true
          })
        }
      })
    });
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, compania: any): void {
    const dialogRef = this.dialog.open(CompaniaDeleteDialogComponent, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: compania
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCompania(result.codigo, result.codigo_cia);
      }
    });
  }

  deleteCompania(codigo: string, codigo_cia: string) {
    try {
      let newTiposEncuestaArray: any[] = [];
      this.store.dispatch(DELETE_COMPANIA({ codigo, codigo_cia }));
      this.store.pipe(select(tipos_encuesta)).subscribe(tipos_encuesta => {
        this.store.dispatch(GET_COMPANIAS());
        this.tipos_encuesta = tipos_encuesta;
        tipos_encuesta.map(tipo_encuesta => {
          if (tipo_encuesta.codigo === codigo && tipo_encuesta.codigo_cia === codigo_cia) {
            newTiposEncuestaArray.push({codigo: tipo_encuesta.codigo, codigo_cia: tipo_encuesta.codigo_cia, identificador: tipo_encuesta.identificador});
          }
        })
      })
      for (let i = 0; i < newTiposEncuestaArray.length; i++) {
        const element = newTiposEncuestaArray[i];
        this.store.dispatch(DELETE_TIPOS_ENCUESTA_SUCCESS({deleteTipoEncuesta: element}))
      }
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.companiaState === "deleted" && data.loginStatus === "logged") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, companiaState: "done" } }));
          this.toastr.success("Compañía eliminada exitosamente.", "Compañías", {
            progressBar: true
          });
        } else if (data.apiStatus === 'error' && data.companiaState === "deletedError" && data.loginStatus === "logged"){
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, companiaState: "" } }));
          this.toastr.error(data.apiResponseMessage, "Compañías", {
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

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

}
