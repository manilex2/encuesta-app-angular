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
}
