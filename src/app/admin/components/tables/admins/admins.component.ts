import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AdminService } from "../../../services/admin.service";
import { Admin } from '../../../models/Admin';

@Component({
  selector: 'app-admins-table',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent {
  columnas: string[] = ['codigo', 'nombre', 'fsbs', 'createdIp', 'createdAt', 'updatedIp', 'updatedAt', 'logo'];
  dataSource:any;

  admins: Admin[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.obtenerTodosAdmins()
    .subscribe( admins => {
      this.admins = admins;
      this.dataSource = new MatTableDataSource<Admin>(this.admins);
    })
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
}
