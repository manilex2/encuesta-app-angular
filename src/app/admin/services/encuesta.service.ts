import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Encuesta } from '../components/models';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  obtenerEncuestas(): Observable<Encuesta[]> {
    return this.http.get<Encuesta[]>(`${this.serverURL}/encuesta`)
  }

  crearEncuesta(encuesta: Encuesta): Observable<Encuesta> {
    try {
      return this.http.post<Encuesta>(`${this.serverURL}/encuesta/create`, encuesta);
    } catch (error) {
      throw error;
    }
  }

  actualizarEncuesta(tipoEncuesta: Encuesta, codigo: string, codigo_cia: string, identificador: string, numero: number): Observable<Encuesta> {
    try {
      return this.http.put<Encuesta>(`${this.serverURL}/encuesta/edit/${codigo}/${codigo_cia}/${identificador}/${numero}`, tipoEncuesta);
    } catch (error) {
      throw error;
    }
  }

  eliminarEncuesta(codigo: string, codigo_cia: string, tipo_encuesta: string, numero: number): Observable<Encuesta> {
    try {
      return this.http.delete<Encuesta>(`${this.serverURL}/encuesta/delete/${codigo}/${codigo_cia}/${tipo_encuesta}/${numero}`);
    } catch (error) {
      throw error;
    }
  }

  getIPAddress() {
    return this.http.get("https://api.ipify.org/?format=json");
  }
}
