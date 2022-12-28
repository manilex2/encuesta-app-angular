import { Component, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort } from '@angular/material/sort';
import { Cliente } from "../models";

@Component({
  selector: 'app-lista-clientes',
  templateUrl: '../views/lista-clientes.component.html',
  styleUrls: ['../styles/lista-clientes.component.scss']
})
export class ListaClientesComponent {

  columnas: string[] = ['nombre'];

  clientes: Cliente[] = [];
  dataSource:any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    for (let x = 1; x <= 100; x++) {
      var cliente: Cliente = {
        nombre: `Cliente ${x}`,
      }
      this.clientes.push(cliente);
      this.dataSource = new MatTableDataSource<Cliente>(this.clientes);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

}
