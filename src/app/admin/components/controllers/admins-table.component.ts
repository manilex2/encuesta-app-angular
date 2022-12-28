import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort } from '@angular/material/sort';
import { Admin, Compania, TiposEncuesta } from "../models";
import { select, Store } from '@ngrx/store';
import { admins } from '../../store/selectors/admin.selectors';
import { DELETE_ADMIN, GET_ADMINS } from '../../store/actions/admin.actions';
import { Appstate } from 'src/app/shared/store/AppState';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { ToastrService } from 'ngx-toastr';
import { currentUser } from '../../store/selectors/currentuser.selectors';
import { Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { AdminDeleteDialogComponent } from './admin-delete-dialog.component';
import { DELETE_COMPANIA_SUCCESS, GET_COMPANIAS } from '../../store/actions/companias.actions';
import { companias } from '../../store/selectors/companias.selectors';
import { tipos_encuesta } from '../../store/selectors/tiposencuesta.selectors';
import { DELETE_TIPOS_ENCUESTA_SUCCESS } from '../../store/actions/tiposencuesta.actions';

@Component({
  selector: 'app-admins-table',
  templateUrl: '../views/admins-table.component.html',
  styleUrls: ['../styles/admins-table.component.scss']
})
export class AdminsTableComponent implements OnInit {
  columnas: string[] = ['codigo', 'nombre', 'fsbs', 'createdIp', 'createdAt', 'updatedIp', 'updatedAt', 'logo', 'edit'];
  admins: Admin[] = [];
  dataSource: any;
  currentUser: any;
  companias: Compania[] = [];
  tipos_encuesta: TiposEncuesta[] = [];
  compList: Compania[] = [];
  compAdminList: Compania[] = [];

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
    this.store.pipe(select(admins)).subscribe(admin => {
      this.store.dispatch(GET_ADMINS());
      this.admins = admin;
      this.dataSource = new MatTableDataSource<Admin>(this.admins);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      let apiStatus$ = this.appStore.pipe(select(selectAppState));
      apiStatus$.subscribe((data) => {
        if (data.apiStatus === "success" && data.adminState === "getted" && data.loginStatus === "logged") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, adminState: "done" } }));
          this.toastr.success("Admins recuperados con exito.", "Admin", {
            progressBar: true
          })
        } else if (data.apiStatus === "error" && data.adminState === "gettedError" && data.loginStatus === "logged") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, adminState: "" } }));
          this.toastr.error(data.apiResponseMessage, "Admin", {
            progressBar: true
          })
        }
      })
    })

    this.store.pipe(select(currentUser)).subscribe(currentUser => {
      this.currentUser = currentUser;
    })
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, admin: any): void {
    const dialogRef = this.dialog.open(AdminDeleteDialogComponent, {
      width: '350px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: admin
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAdmin(result.codigo);
      }
    });
  }

  deleteAdmin(codigo: string) {
    try {
      let newCompaniasArray: any[] = [];
      let newTiposEncuestaArray: any[] = [];
      this.store.dispatch(DELETE_ADMIN({ codigo }));
      this.store.pipe(select(companias)).subscribe(companias => {
        this.store.dispatch(GET_COMPANIAS());
        this.companias = companias;
        companias.map(compania => {
          if (compania.codigo === codigo) {
            newCompaniasArray.push({codigo: compania.codigo, codigo_cia: compania.codigo_cia});
          }
        })
      })
      this.store.pipe(select(tipos_encuesta)).subscribe(tipos_encuesta => {
        this.store.dispatch(GET_COMPANIAS());
        this.tipos_encuesta = tipos_encuesta;
        tipos_encuesta.map(tipo_encuesta => {
          if (tipo_encuesta.codigo === codigo) {
            newTiposEncuestaArray.push({codigo: tipo_encuesta.codigo, codigo_cia: tipo_encuesta.codigo_cia, identificador: tipo_encuesta.identificador});
          }
        })
      })
      for (let i = 0; i < newCompaniasArray.length; i++) {
        const element = newCompaniasArray[i];
        this.store.dispatch(DELETE_COMPANIA_SUCCESS({deleteCompania: element}))
      }
      for (let i = 0; i < newTiposEncuestaArray.length; i++) {
        const element = newTiposEncuestaArray[i];
        this.store.dispatch(DELETE_TIPOS_ENCUESTA_SUCCESS({deleteTipoEncuesta: element}))
      }
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.adminState === "deleted" && data.loginStatus === "logged") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, adminState: "done" } }));
          this.toastr.success("Admin eliminado exitosamente.", "Admin", {
            progressBar: true
          });
        } else if (data.apiStatus === 'error' && data.adminState === "deletedError" && data.loginStatus === "logged"){
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

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }


}
