import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  serverURL = environment.serverURL;
  token: any;

  constructor(private http: HttpClient, private router: Router, public jwtHelper: JwtHelperService) {}

  isAuthenticated(): boolean {
    const token: any = localStorage.getItem('auth_token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  login(user: any) {
    this.http.post(this.serverURL + '/authenticate', { codigo: user.codigo, usuario: user.usuario, clave: user.clave })
    .subscribe((resp: any) => {
      this.router.navigate(['admin']);
      localStorage.setItem('auth_token', resp.token);
    });
  }
}
