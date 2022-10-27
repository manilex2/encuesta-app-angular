import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
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
