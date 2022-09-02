import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TipoEncuesta } from "../interfaces/TipoEncuesta";

@Component({
  selector: 'app-tipos-encuesta',
  templateUrl: '../views/tipos-encuesta.component.html',
  styleUrls: ['../styles/tipos-encuesta.component.scss']
})
export class TiposEncuestaComponent {
  columnas: string[] = ['tipo_encuesta'];
  tipos_encuesta: TipoEncuesta[] = [];
  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    for (let x = 1; x <= 100; x++) {
      var tipo_encuesta: TipoEncuesta = {
        tipo_encuesta: `Tipo de Encuesta ${x}`,
      }
      this.tipos_encuesta.push(tipo_encuesta);
      this.dataSource = new MatTableDataSource<TipoEncuesta>(this.tipos_encuesta);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
}
