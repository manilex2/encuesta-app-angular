import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Encuesta } from "../../../interfaces/Encuesta";

@Component({
  selector: 'app-encuestas-table',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.scss']
})
export class EncuestasComponent {

  columnas: string[] = ['codigo', 'encuesta'];

  encuestas: Encuesta[] = [];
  dataSource:any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    for (let x = 1; x <= 100; x++) {
      var encuesta: Encuesta = {
        codigo: `${x}`,
        encuesta: `Encuesta ${x}`,
      }
      this.encuestas.push(encuesta);
      this.dataSource = new MatTableDataSource<Encuesta>(this.encuestas);
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

}
