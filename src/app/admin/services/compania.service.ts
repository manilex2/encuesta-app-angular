import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Compania } from '../components/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompaniaService {

  serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  obtenerTodasCompanias(): Observable<Compania[]> {
    return this.http.get<Compania[]>(`${this.serverURL}/companias`)
  }

  crearCompania(compania: Compania): Observable<Compania> {
    try {
      return this.http.post<Compania>(`${this.serverURL}/companias/create`, compania);
    } catch (error) {
      throw error;
    }
  }

  actualizarCompania(compania: Compania, codigo: string, codigo_cia: string): Observable<Compania> {
    try {
      return this.http.put<Compania>(`${this.serverURL}/companias/edit/${codigo}/${codigo_cia}`, compania);
    } catch (error) {
      throw error;
    }
  }

  eliminarCompania(codigo: string, codigo_cia: string): Observable<Compania> {
    try {
      return this.http.delete<Compania>(`${this.serverURL}/companias/delete/${codigo}/${codigo_cia}`);
    } catch (error) {
      throw error;
    }
  }

  getIPAddress() {
    return this.http.get("https://api.ipify.org/?format=json");
  }
}
