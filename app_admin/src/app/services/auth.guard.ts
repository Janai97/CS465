import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Authentication } from './authentication';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: Authentication, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}