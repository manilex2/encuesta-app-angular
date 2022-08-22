import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: '../views/nav.component.html',
  styleUrls: ['../styles/nav.component.scss']
})
export class NavComponent {

  constructor(private router: Router) { }

  public get logIn(): boolean {
    return (localStorage.getItem('auth_token') !== null);
  }

  logout() {
    this.router.navigate(["auth"]);
    localStorage.removeItem('auth_token');
  }

}
