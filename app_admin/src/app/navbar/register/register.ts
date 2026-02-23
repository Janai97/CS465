import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TripData } from '../../services/trip-data';
import { Authentication } from '../../services/authentication';
import { User } from '../../models/user';
import { AuthResponse } from '../../models/AuthResponse';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register {
  public formError: string = '';

  form = {
    name: '',
    email: '',
    password: '',
    password2: '',
    agree: false,
  };

  constructor(
    private router: Router,
    private tripDataService: TripData,
    private authenticationService: Authentication
  ) {}

  public onRegisterSubmit(): void {
    this.formError = '';

    if (!this.form.name || !this.form.email || !this.form.password || !this.form.password2) {
      this.formError = 'All fields are required.';
      return;
    }

    if (this.form.password !== this.form.password2) {
      this.formError = 'Passwords do not match.';
      return;
    }

    if (!this.form.agree) {
      this.formError = 'You must agree to the Terms of Use and Privacy Policy.';
      return;
    }

    const user = { name: this.form.name, email: this.form.email } as User;

    this.tripDataService.register(user, this.form.password).subscribe({
      next: (value: AuthResponse) => {
        if (value?.token) {
          this.authenticationService.saveToken(value.token);
          this.router.navigate(['/travel']);
        } else {
          this.formError = 'Registration failed. Please try again.';
        }
      },
      error: () => {
        this.formError = 'Registration failed. Please try again.';
      },
    });
  }
}