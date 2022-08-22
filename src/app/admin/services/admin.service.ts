import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Admins } from '../components/interfaces/Admins';
import { map } from 'rxjs/operators';
import { Admin } from '../components/models/Admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  obtenerTodosAdmins () {
    return this.http.get<Admins>(`${this.serverURL}/users/admins`)
    .pipe(
      map(resp => {
        return resp.data.map(admin => Admin.adminDesdeJson(admin));
      })
    )
  }
}
