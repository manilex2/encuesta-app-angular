import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Admins } from '../interfaces/Admins';
import { map } from 'rxjs/operators';
import { Admin } from '../models/Admin';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  obtenerTodosAdmins () {
    return this.http.get<Admins>(`${this.serverURL}/admin/all`)
    .pipe(
      map(resp => {
        return resp.data.map(admin => Admin.adminDesdeJson(admin));
      })
    )
  }
}
