import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Companias } from '../components/interfaces/Companias';
import { delay, map } from 'rxjs/operators';
import { Compania } from '../components/models/Compania';

@Injectable({
  providedIn: 'root'
})
export class CompaniaService {

  serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  obtenerTodasCompanias () {
    return this.http.get<Companias>(`${this.serverURL}/companias`)
    .pipe(
      map(resp => {
        return resp.data.map(compania => Compania.companiaDesdeJson(compania));
      })
    )
  }
}
