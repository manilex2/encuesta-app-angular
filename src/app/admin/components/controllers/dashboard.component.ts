import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatAccordion } from '@angular/material/expansion';
import { ChartDialogComponent } from './chart-dialog.component';
import { select, Store } from '@ngrx/store';
import { response } from '../../store/selectors/response.selectors';
import { GET_RESPONSE } from '../../store/actions/response.actions';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: '../views/dashboard.component.html',
  styleUrls: ['../styles/dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  respuestas: any;
  identificadores: any;
  companias: any;
  admins: any;
  preguntas: any;

  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;

  constructor(
    public dialog: MatDialog,
    private store: Store,
  ) { }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, codigo: any, compania: any, identificador: any, pregunta: any) {
    const responseData = this.respuestas.filter((_) => (_.codigo == codigo && _.codigo_cia == compania && _.identificador == identificador && _.pregunta == pregunta));
    const dialogRef = this.dialog.open(ChartDialogComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      maxWidth: "100vw",
      maxHeight: "100vh",
      data: responseData
    });

    dialogRef.afterClosed().subscribe(result => {
      return
    });
  }

  ngOnInit(): void {
    this.store.pipe(select(response)).subscribe(respuestas => {
      this.store.dispatch(GET_RESPONSE());
      this.respuestas = respuestas;
      const adminKey = 'codigo';
      const adminUniqueByKey = [...new Map(this.respuestas.map(item => [item[adminKey], item])).values()];
      this.admins = adminUniqueByKey;
      const companiasKey = 'codigo_cia';
      const companiasUniqueByKey = [...new Map(this.respuestas.map(item => [item[companiasKey], item])).values()];
      this.companias = companiasUniqueByKey;
      const identificadorKey = 'identificador';
      const identificadorUniqueByKey = [...new Map(this.respuestas.map(item => [item[identificadorKey], item])).values()];
      this.identificadores = identificadorUniqueByKey;
    })
  }

}
