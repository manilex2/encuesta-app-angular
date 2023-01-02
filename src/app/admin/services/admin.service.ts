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

  actualizarAdmin(adminUser: Admin, codigo: string): Observable<Admin> {
    try {
      return this.http.put<Admin>(`${this.serverURL}/admins/edit/${codigo}`, adminUser);
    } catch (error) {
      throw error;
    }
  }

  eliminarAdmin(codigo: string): Observable<Admin> {
    try {
      return this.http.delete<Admin>(`${this.serverURL}/admins/delete/${codigo}`);
    } catch (error) {
      throw error;
    }
  }

  getIPAddress() {
    return this.http.get("https://api.ipify.org/?format=json");
  }

  obtenerClientResponse(): Observable<any[]> {
    try {
      return this.http.get<Response[]>(`${this.serverURL}/client`);
    } catch (error) {
      throw error;
    }
  }
}
