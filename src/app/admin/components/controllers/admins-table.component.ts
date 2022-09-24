import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Admin } from "../models";
import { select, Store } from '@ngrx/store';
import { admins } from '../../store/selectors/admin.selectors';
import { DELETE_ADMIN, GET_ADMINS } from '../../store/actions/admin.actions';
import { Appstate } from 'src/app/shared/store/AppState';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';
import { ToastrService } from 'ngx-toastr';
import { currentUser } from '../../store/selectors/currentuser.selectors';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdminDeleteDialogComponent } from './admin-delete-dialog.component';

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

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private store: Store,
    private appStore: Store<Appstate>,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit():void {
    this.store.pipe(select(admins)).subscribe(admin => {
      this.store.dispatch(GET_ADMINS());
      this.admins = admin;
      this.dataSource = new MatTableDataSource<Admin>(this.admins);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      let apiStatus$ = this.appStore.pipe(select(selectAppState));
      apiStatus$.subscribe((data) => {
        if (data.apiStatus === "success" && data.adminState === "getted" && data.loginStatus === "login") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, adminState: "done" } }));
          this.toastr.success("Admins recuperados con exito.", "Admin", {
            progressBar: true
          })
        } else if (data.apiStatus === "error" && data.adminState === "error" && data.loginStatus === "login") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, adminState: "done" } }));
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
      this.store.dispatch(DELETE_ADMIN({ codigo }));
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === 'success' && data.adminState === "deleted") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, adminState: "done" } }));
          this.toastr.success("Admin eliminado exitosamente.", "Admin", {
            progressBar: true
          });
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

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }


}
