import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Compania } from '../models/Compania';
import { select, Store } from '@ngrx/store';
import { companias } from '../../store/selectors/companias.selectors';
import { GET_COMPANIAS } from '../../store/actions/companias.actions';
import { Appstate } from 'src/app/shared/store/AppState';
import { ToastrService } from 'ngx-toastr';
import { selectAppState } from 'src/app/shared/store/selectors/app.selectors';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';

@Component({
  selector: 'app-companias',
  templateUrl: '../views/companias.component.html',
  styleUrls: ['../styles/companias.component.scss']
})
export class CompaniasComponent implements OnInit {
  columnas: string[] = [ 'codigo', 'codigo_cia', 'origen_dato', 'origen_puerto', 'origen_name_DB', 'origen_user', 'origen_clave', 'email_smtp', 'email_puerto', 'email_salida', 'email_clave', 'email_tema', 'email_mensaje', 'email_office_365', 'createdIp', 'createdAt', 'updatedIp', 'updatedAt', 'cia_logo', 'vista_lista'];
  companias: Compania[] = [];
  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private store: Store,
    private appStore: Store<Appstate>,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.store.pipe(select(companias))
    .subscribe(compania => {
      this.store.dispatch(GET_COMPANIAS());
      this.companias = compania;
      this.dataSource = new MatTableDataSource<Compania>(this.companias);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      let appStatus$ = this.appStore.pipe(select(selectAppState));
      appStatus$.subscribe((data) => {
        if (data.apiStatus === "success" && data.companiaState === "") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200, companiaState: "done" } }));
        } else if (data.apiStatus === "error") {
          this.appStore.dispatch(setAPIStatus({ apiStatus: { apiStatus: '', apiResponseMessage: '', apiCodeStatus: 200 } }));
        }
      });
    });
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

}
