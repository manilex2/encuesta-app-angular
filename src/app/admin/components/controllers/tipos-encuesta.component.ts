import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TiposEncuesta } from '../models/';
import { Store, select } from '@ngrx/store';
import { GET_TIPOS_ENCUESTA } from '../../store/actions/tiposencuesta.actions';
import { tipos_encuesta } from '../../store/selectors/tiposencuesta.selectors';

@Component({
  selector: 'app-tipos-encuesta',
  templateUrl: '../views/tipos-encuesta.component.html',
  styleUrls: ['../styles/tipos-encuesta.component.scss']
})
export class TiposEncuestaComponent {
  columnas: string[] = ['codigo', 'identificador', 'descripcion', 'afectacion', 'createdIp', 'createdAt', 'updatedIp', 'updatedAt'];
  tiposencuesta: TiposEncuesta[] = [];
  dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.pipe(select(tipos_encuesta))
    .subscribe(tipo => {
      this.tiposencuesta = tipo;
      this.dataSource = new MatTableDataSource<TiposEncuesta>(this.tiposencuesta);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.store.dispatch(GET_TIPOS_ENCUESTA());
    });
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }
}
