import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Client } from "../components/models";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  obtenerClientData(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.serverURL}/client`)
  }
}
