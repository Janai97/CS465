import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrls: ['./trip-card.css'],
})
export class TripCardComponent {
  @Input() trip!: Trip;

  constructor(
    private router: Router,
    private tripService: TripData,
    private authService: Authentication
  ) {}

  // Show edit/delete only if logged in
  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // ===== EDIT =====
  public editTrip(trip: Trip): void {
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  // ===== DELETE =====
  public deleteTrip(trip: Trip): void {
    if (!this.isLoggedIn()) return;

    const confirmDelete = confirm(`Are you sure you want to delete "${trip.name}"?`);
    if (!confirmDelete) return;

    this.tripService.deleteTrip(trip.code).subscribe({
      next: () => {
        console.log('Trip deleted successfully');

        // Refresh page so list updates immediately
        window.location.reload();
      },
      error: (error: any) => {
        console.error('Delete failed:', error);
        alert('Failed to delete trip.');
      },
    });
  }
}