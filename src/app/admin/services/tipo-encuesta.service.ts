import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TiposEncuesta } from '../components/models/TipoEncuesta';

@Injectable({
  providedIn: 'root'
})
export class TipoEncuestaService {

  serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  obtenerTiposEncuestas(): Observable<TiposEncuesta[]> {
    return this.http.get<TiposEncuesta[]>(`${this.serverURL}/tiposEncuesta`)
  }
}
