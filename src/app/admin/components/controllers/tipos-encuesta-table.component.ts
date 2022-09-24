import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TiposEncuesta } from '../models';
import { Store, select } from '@ngrx/store';
import { DELETE_TIPOS_ENCUESTA, GET_TIPOS_ENCUESTA } from '../../store/actions/tiposencuesta.actions';
import { tipos_encuesta } from '../../store/selectors/tiposencuesta.selectors';
import { Appstate } from 'src/app/shared/store/AppState';
import { ToastrService } from 'ngx-toastr';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TiposEncuestaDeleteDialogComponent } from './tipos-encuesta-delete-dialog.component';

@Component({
  selector: 'app-tipos-encuesta',
  templateUrl: '../views/tipos-encuesta-table.component.html',
  styleUrls: ['../styles/tipos-encuesta-table.component.scss']
})
export class TiposEncuestaTableComponent {
  columnas: string[] = ['codigo', 'identificador', 'descripcion', 'afectacion', 'createdIp', 'createdAt', 'updatedIp', 'updatedAt', 'edit'];
  tiposencuesta: TiposEncuesta[] = [];
  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private store: Store,
    private appStore: Store<Appstate>,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.store.pipe(select(tipos_encuesta)).subscribe(tiposencuesta => {
      this.store.dispatch(GET_TIPOS_ENCUESTA());
      this.tiposencuesta = tiposencuesta;
      this.dataSource = new MatTableDataSource<TiposEncuesta>(this.tiposencuesta);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      let apiStatus$ = this.appStore.pipe(select(selectAppState));
      apiStatus$.subscribe((data) => {
        if (data.apiStatus === "success" && data.tiposEncuestaState === "getted" && data.loginStatus === "login") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, tiposEncuestaState: "done" } }));
          this.toastr.success("Tipos de encuesta recuperados con exito.", "Tipos de Encuesta", {
            progressBar: true
          })
        } else if (data.apiStatus === "error" && data.tiposEncuestaState === "error" && data.loginStatus === "login") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, tiposEncuestaState: "done" } }));
          this.toastr.error(data.apiResponseMessage, "Tipos de Encuesta", {
            progressBar: true
          })
        }
      })
    });
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
        this.deleteAdmin(result.codigo, result.identificador);
      }
    });
  }

  deleteAdmin(codigo: string, identificador: string) {
    try {
      this.store.dispatch(DELETE_TIPOS_ENCUESTA({ codigo, identificador }));
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.tiposEncuestaState === "deleted") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, tiposEncuestaState: "done" } }));
          this.toastr.success("Tipo de encuesta eliminada exitosamente.", "Tipos de Encuesta", {
            progressBar: true
          });
        } else if (data.apiStatus === 'error'){
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200 } }));
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

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
}
