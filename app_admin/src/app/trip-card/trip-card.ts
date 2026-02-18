import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { AuthenticationService } from '../services/authentication';
import { TripData } from '../services/trip-data';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCardComponent implements OnInit {

  @Input('trip') trip!: Trip;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private tripDataService: TripData
  ) {}

  ngOnInit(): void {}

  // ---------- EDIT ----------
  public editTrip(trip: Trip): void {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  // ---------- DELETE ----------
  public deleteTrip(trip: Trip): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      this.tripDataService.deleteTrip(trip.code).subscribe({
        next: () => {
          alert('Trip deleted successfully');
          window.location.reload(); // simple refresh
        },
        error: (err) => {
          console.log(err);
          alert('Error deleting trip');
        }
      });
    }
  }

  // ---------- AUTH CHECK ----------
  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }
}
