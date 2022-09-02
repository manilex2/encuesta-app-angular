import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Admins } from '../components/interfaces/Admins';
import { CreateAdmin } from '../components/interfaces/CreateAdmin';
import { map, delay } from 'rxjs/operators';
import { Admin } from '../components/models/Admin';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  obtenerTodosAdmins (): Observable<any> {
    return this.http.get<Admins>(`${this.serverURL}/admins`)
    .pipe(
      map(resp => {
        return resp.data.map(admin => Admin.adminDesdeJson(admin));
      })
    )
  }

  crearAdmin(adminUser: CreateAdmin) {
    this.http.post(`${this.serverURL}/admins/create`, { adminUser })
    .subscribe((resp: any) => {
      return resp;
    });
  }

  getIPAddress() {
    return this.http.get("https://api.ipify.org/?format=json");
  }
}
