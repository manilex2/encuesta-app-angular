import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Admin } from "../components/models";
import { Observable } from 'rxjs';
import { CurrentUser } from '../components/models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  obtenerTodosAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.serverURL}/admins`)
  }

  obtenerCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${this.serverURL}/admins/currentUser`)
  }

  crearAdmin(adminUser: Admin): Observable<Admin> {
    try {
      return this.http.post<Admin>(`${this.serverURL}/admins/create`, adminUser)
    } catch (error) {
      throw error;
    }

  }

  getIPAddress() {
    return this.http.get("https://api.ipify.org/?format=json");
  }
}
