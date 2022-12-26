import { Component, OnInit } from '@angular/core';
import decode from 'jwt-decode';

@Component({
  selector: 'app-selec-encuesta',
  templateUrl: '../views/selec-encuesta.component.html',
  styleUrls: ['../styles/selec-encuesta.component.scss']
})
export class SelecEncuestaComponent implements OnInit {
  token: any;
  encuestas = []

  constructor() { }

  ngOnInit(): void {
    this.token = localStorage.getItem('auth_token');

    let tokenPayload: any = this.token? decode(this.token) : false;

    this.encuestas = tokenPayload.tipos_encuesta;
  }

}
