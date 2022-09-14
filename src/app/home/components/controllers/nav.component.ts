import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: '../views/nav.component.html',
  styleUrls: ['../styles/nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  public get logIn(): boolean {
    return (localStorage.getItem('auth_token') !== null);
  }

  public get userName(): string {
    return (this.authService.getUserName());
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      localStorage.removeItem('auth_token');
    }
  }

  logout() {
    this.router.navigate(["auth"]);
    localStorage.removeItem('auth_token');
  }

}
