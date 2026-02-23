import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Trip } from '../models/trip';
import { TripData } from '../services/trip-data';
import { TripCardComponent } from '../trip-card/trip-card';
import { Authentication } from '../services/authentication';

type Category = 'beaches' | 'cruises' | 'mountains' | 'all';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.html',
  styleUrls: ['./trip-listing.css'],
})
export class TripListingComponent implements OnInit {
  trips: Trip[] = [];
  filteredTrips: Trip[] = [];

  message: string = '';

  // tabs
  activeCategory: Category = 'beaches';

  // counts
  beachesCount = 0;
  cruisesCount = 0;
  mountainsCount = 0;

  constructor(
    private tripDataService: TripData,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authenticationService: Authentication
  ) {}

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  public setCategory(cat: Category): void {
    this.activeCategory = cat;
    this.applyFilterAndCounts(); // always recompute
  }

  private applyFilterAndCounts(): void {
    // recompute counts from full list
    this.beachesCount = this.trips.filter((t) => this.getCategory(t) === 'beaches').length;
    this.cruisesCount = this.trips.filter((t) => this.getCategory(t) === 'cruises').length;
    this.mountainsCount = this.trips.filter((t) => this.getCategory(t) === 'mountains').length;

    // recompute filtered list for active tab
    if (this.activeCategory === 'all') {
      this.filteredTrips = [...this.trips];
    } else {
      this.filteredTrips = this.trips.filter((t) => this.getCategory(t) === this.activeCategory);
    }

    // update message
    this.message =
      this.trips.length > 0
        ? `There are ${this.trips.length} trips available.`
        : 'There were no trips retrieved from the database';

    // force UI refresh immediately after async update
    this.cdr.detectChanges();
  }

  // categorize by trip code prefix OR name keywords (robust)
  private getCategory(trip: Trip): Category {
    const code = (trip?.code || '').toUpperCase();
    const name = (trip?.name || '').toLowerCase();

    // If you seeded with B#### / C#### / M####, this works perfectly:
    if (code.startsWith('B')) return 'beaches';
    if (code.startsWith('C')) return 'cruises';
    if (code.startsWith('M')) return 'mountains';

    // fallback heuristics (if your codes are not B/C/M)
    if (name.includes('cruise')) return 'cruises';
    if (name.includes('mountain')) return 'mountains';
    return 'beaches';
  }

  private loadTrips(): void {
    this.tripDataService.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips = value ?? [];
        this.applyFilterAndCounts();
      },
      error: (error: any) => {
        console.log('Error: ' + error);
        this.message = 'Error retrieving trips from the database';
        this.trips = [];
        this.filteredTrips = [];
        this.beachesCount = 0;
        this.cruisesCount = 0;
        this.mountainsCount = 0;
        this.cdr.detectChanges();
      },
    });
  }

  ngOnInit(): void {
    this.loadTrips();
  }
}