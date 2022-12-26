import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  serverURL = environment.serverURL;

  constructor(private http: HttpClient) { }

  saveClientData(data: any): Observable<any[]> {
    try {
      return this.http.post<any>(`${this.serverURL}/client/create`, data);
    } catch (error) {
      throw error;
    }
  };

  getIPAddress() {
    return this.http.get("https://api.ipify.org/?format=json");
  };
}
