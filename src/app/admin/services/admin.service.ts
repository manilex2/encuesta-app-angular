import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CreateAdmin } from '../components/interfaces/CreateAdmin';
import { Admin } from "../components/models/Admin";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  obtenerTodosAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.serverURL}/admins`)
  }

  obtenerCurrentUser(): Observable<Admin> {
    return this.http.get<Admin>(`${this.serverURL}/admins/currentUser`)
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
