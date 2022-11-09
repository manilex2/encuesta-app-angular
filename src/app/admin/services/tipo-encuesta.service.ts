import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TiposEncuesta } from '../components/models';

@Injectable({
  providedIn: 'root'
})
export class TipoEncuestaService {

  serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  obtenerTiposEncuestas(): Observable<TiposEncuesta[]> {
    return this.http.get<TiposEncuesta[]>(`${this.serverURL}/tiposEncuesta`)
  }

  crearTipoEncuesta(tipoEncuesta: TiposEncuesta): Observable<TiposEncuesta> {
    try {
      return this.http.post<TiposEncuesta>(`${this.serverURL}/tiposEncuesta/create`, tipoEncuesta);
    } catch (error) {
      throw error;
    }
  }

  actualizarTipoEncuesta(tipoEncuesta: TiposEncuesta, codigo: string, identificador: string): Observable<TiposEncuesta> {
    try {
      return this.http.put<TiposEncuesta>(`${this.serverURL}/tiposEncuesta/edit/${codigo}/${identificador}`, tipoEncuesta);
    } catch (error) {
      throw error;
    }
  }

  eliminarTipoEncuesta(codigo: string, codigo_cia: string, tipo_encuesta: string): Observable<TiposEncuesta> {
    try {
      return this.http.delete<TiposEncuesta>(`${this.serverURL}/tiposEncuesta/delete/${codigo}/${codigo_cia}/${tipo_encuesta}`);
    } catch (error) {
      throw error;
    }
  }

  getIPAddress() {
    return this.http.get("https://api.ipify.org/?format=json");
  }
}
