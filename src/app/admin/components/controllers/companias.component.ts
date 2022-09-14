import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Compania } from '../models/Compania';
import { select, Store } from '@ngrx/store';
import { companias } from '../../store/selectors/companias.selectors';
import { GET_COMPANIAS } from '../../store/actions/companias.actions';

@Component({
  selector: 'app-companias',
  templateUrl: '../views/companias.component.html',
  styleUrls: ['../styles/companias.component.scss']
})
export class CompaniasComponent {

  columnas: string[] = [ 'codigo', 'codigo_cia', 'origen_dato', 'origen_puerto', 'origen_name_DB', 'origen_user', 'origen_clave', 'email_smtp', 'email_puerto', 'email_salida', 'email_clave', 'email_tema', 'email_mensaje', 'email_office_365', 'createdIp', 'createdAt', 'updatedIp', 'updatedAt', 'cia_logo', 'vista_lista'];
  companias: Compania[] = [];
  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.pipe(select(companias))
    .subscribe(compania => {
      this.companias = compania;
      this.dataSource = new MatTableDataSource<Compania>(this.companias);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.store.dispatch(GET_COMPANIAS());
    });
  }
  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

}
