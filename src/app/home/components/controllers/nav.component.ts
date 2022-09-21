import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: '../views/nav.component.html',
  styleUrls: ['../styles/nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private overlay: OverlayContainer) { }

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

  toggleTheme(): void {
    if (this.overlay.getContainerElement().classList.contains("theme-alternate")) {
      this.overlay.getContainerElement().classList.remove("theme-alternate");
    } else {
      this.overlay.getContainerElement().classList.add("theme-alternate");
    }
    if (document.body.classList.contains("theme-alternate")) {
      document.body.classList.remove("theme-alternate");
      document.querySelector(".custom-toolbar")?.classList.remove("dark-background");
      document.querySelector(".create-button-custom")?.classList.remove("dark-background");
    } else {
      document.body.classList.add("theme-alternate");
      document.querySelector(".custom-toolbar")?.classList.add("dark-background");
      document.querySelector(".create-button-custom")?.classList.add("dark-background");
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(["auth"]);
  }
}
