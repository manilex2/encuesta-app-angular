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
    try {
      return this.http.get<Admin[]>(`${this.serverURL}/admins`);
    } catch (error) {
      throw error;
    }
  }

  obtenerCurrentUser(): Observable<CurrentUser> {
    try {
      return this.http.get<CurrentUser>(`${this.serverURL}/admins/currentUser`);
    } catch (error) {
      throw error;
    }

  }

  crearAdmin(adminUser: Admin): Observable<Admin> {
    try {
      return this.http.post<Admin>(`${this.serverURL}/admins/create`, adminUser);
    } catch (error) {
      throw error;
    }
  }

  getIPAddress() {
    return this.http.get("https://api.ipify.org/?format=json");
  }
}
