import { Component, Input } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import decode from 'jwt-decode';

export interface ExampleTab {
  label: string;
}

@Component({
  selector: 'app-tabs',
  templateUrl: '../views/tabs.component.html',
  styleUrls: ['../styles/tabs.component.scss']
})
export class TabsComponent {
  asyncTabs: Observable<ExampleTab[]>;

  token: any = localStorage.getItem('auth_token');

  tokenPayload: any = this.token? decode(this.token) : false;


  constructor() {
    if (this.tokenPayload.fsbs) {
      this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
        setTimeout(() => {
          observer.next([
            {label: 'Admins'},
            {label: 'Compañías'},
            {label: 'Categorias'},
            {label: 'Encuestas'},
          ]);
        }, 2000);
      });
    } else {
      this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
        setTimeout(() => {
          observer.next([
            {label: 'Compañías'},
            {label: 'Categorias'},
            {label: 'Encuestas'},
          ]);
        }, 2000);
      });
    }

  }

}
