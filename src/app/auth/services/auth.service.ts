import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../components/models';
import decode from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  serverURL = environment.serverURL;
  token: any;

  constructor(private http: HttpClient, private router: Router, public jwtHelper: JwtHelperService) {}

  isFsbs(): boolean {
    this.token = localStorage.getItem('auth_token');

    let tokenPayload: any = this.token? decode(this.token) : false;

    if (tokenPayload.fsbs) {
      return true;
    } else {
      return false;
    }
  }

  getUserName(): string {
    this.token = localStorage.getItem('auth_token');

    let tokenPayload: any = this.token? decode(this.token) : false;

    return tokenPayload.nombre;
  }

  isAuthenticated(): boolean {
    this.token = localStorage.getItem('auth_token');
    return !this.jwtHelper.isTokenExpired(this.token);
  }

  login(user: User) {
    this.http.post(this.serverURL + '/authenticate', { codigo: user.codigo, clave: user.clave })
    .subscribe((resp: any) => {
      this.router.navigate(['admin']);
      localStorage.setItem('auth_token', resp.token);
    });
  }
}
