import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Admin } from '../models/Admin';
import { select, Store } from '@ngrx/store';
import { adminGET } from '../../store/actions/admin.action';
import { selectAdmins } from '../../store/selectors/admin.selector';

@Component({
  selector: 'app-admins-table',
  templateUrl: '../views/admins.component.html',
  styleUrls: ['../styles/admins.component.scss']
})
export class AdminsComponent {

  columnas: string[] = ['codigo', 'nombre', 'fsbs', 'createdIp', 'createdAt', 'updatedIp', 'updatedAt', 'logo'];
  admins: Admin[] = [];
  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.pipe(select(selectAdmins))
    .subscribe(admin => {
      this.admins = admin;
      this.dataSource = new MatTableDataSource<Admin>(this.admins);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.store.dispatch(adminGET());
    });
  }
  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
}
