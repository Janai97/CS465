import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';
import { User } from '../models/user';
import { AuthResponse } from '../models/AuthResponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  public formError: string = '';

  credentials = {
    email: '',
    password: '',
  };

  constructor(
    private router: Router,
    private tripDataService: TripData,
    private authenticationService: Authentication
  ) {}

  public onLoginSubmit(): void {
    this.formError = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.formError = 'Email and password are required.';
      return;
    }

    const user = { name: 'temp', email: this.credentials.email } as User;

    this.tripDataService.login(user, this.credentials.password).subscribe({
      next: (value: AuthResponse) => {
        console.log('LOGIN response:', value);

        if (!value?.token) {
          this.formError = 'Login failed: no token returned from server.';
          return;
        }

        // Save token
        this.authenticationService.saveToken(value.token);

        // Debug: confirm it saved
        const saved = this.authenticationService.getToken();
        console.log('Saved token:', saved);

        // Only redirect if token is valid per isLoggedIn()
        if (this.authenticationService.isLoggedIn()) {
          this.router.navigate(['']);
        } else {
          this.formError =
            'Token saved, but app considers it invalid. Your JWT is probably missing "exp". Fix backend generateJWT().';
        }
      },
      error: (err: any) => {
        console.log('LOGIN error:', err);
        const msg =
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          'Login failed. Check your credentials and try again.';
        this.formError = msg;
      },
    });
  }
}