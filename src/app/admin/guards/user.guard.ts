import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate, CanLoad {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (!this.auth.notUser()) {
      this.router.navigate(['user']);
      return false;
    }
    return true;
  }
  canLoad(): boolean {
    if (!this.auth.notUser()) {
      this.router.navigate(['user']);
      return false;
    }
    return true;
  }
}
