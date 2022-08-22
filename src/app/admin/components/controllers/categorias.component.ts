import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Categoria } from "../interfaces/Categoria";

@Component({
  selector: 'app-categorias-table',
  templateUrl: '../views/categorias.component.html',
  styleUrls: ['../styles/categorias.component.scss']
})
export class CategoriasComponent {
  columnas: string[] = ['codigo', 'categoria'];
  categorias: Categoria[] = [];
  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    for (let x = 1; x <= 100; x++) {
      var categoria: Categoria = {
        codigo: `${x}`,
        categoria: `Categoria ${x}`,
      }
      this.categorias.push(categoria);
      this.dataSource = new MatTableDataSource<Categoria>(this.categorias);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
}
