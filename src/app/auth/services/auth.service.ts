import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../components/models';
import decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { Appstate } from 'src/app/shared/store/AppState';
import { Store } from '@ngrx/store';
import { setAPIStatus } from 'src/app/shared/store/actions/app.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  serverURL = environment.serverURL;
  token: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    public jwtHelper: JwtHelperService,
    private appStore: Store<Appstate>
  ) {}

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
      this.appStore.dispatch(setAPIStatus({apiStatus: { apiCodeStatus: 200, apiResponseMessage: '', apiStatus: '', loginStatus: "login" }}))
      this.router.navigate(['admin']);
      localStorage.setItem('auth_token', resp.token)
    });
  }
}
