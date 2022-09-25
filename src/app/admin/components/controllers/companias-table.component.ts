import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
import { MatDialog } from '@angular/material/dialog';
import { CompaniaDeleteDialogComponent } from '../controllers/compania-delete-dialog.component';
import { Observable } from 'rxjs';

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
        this.deleteAdmin(result.codigo, result.codigo_cia);
      }
    });
  }

  deleteAdmin(codigo: string, codigo_cia: string) {
    try {
      this.store.dispatch(DELETE_COMPANIA({ codigo, codigo_cia }));
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
