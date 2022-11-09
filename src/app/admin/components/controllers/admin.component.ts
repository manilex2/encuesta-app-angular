import { Component } from '@angular/core';
import decode from 'jwt-decode';
import { Navs } from '../models';

@Component({
  selector: 'app-admin',
  templateUrl: '../views/admin.component.html',
  styleUrls: ['../styles/admin.component.scss']
})

export class AdminComponent {

  links: Navs[] = [];

  index: number = 0;

  token: any = localStorage.getItem('auth_token');

  tokenPayload: any = this.token? decode(this.token) : false;

  constructor() {
    if (this.tokenPayload.fsbs) {
      this.links = [
        {ruta: 'dashboard', nombre: 'Dashboard'},
        {ruta: 'admins', nombre: 'Usuarios'},
        {ruta: 'companias', nombre: 'Compañías'},
        {ruta: 'tipos_encuesta', nombre: 'Tipos de Encuesta'},
        /* {ruta: 'clientes', nombre: 'Lista de Clientes'} */
      ];
    } else {
      this.links = [
        {ruta: 'dashboard', nombre: 'Dashboard'},
        {ruta: 'admins', nombre: 'Usuarios'},
        {ruta: 'tipos_encuesta', nombre: 'Tipos de Encuesta'},
        /* {ruta: 'clientes', nombre: 'Lista de Clientes'} */
      ];
    }
  }

}
