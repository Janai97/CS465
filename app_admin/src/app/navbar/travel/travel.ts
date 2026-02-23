import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Trip } from '../../models/trip';
import { TripData } from '../../services/trip-data';
import { Authentication } from '../../services/authentication';

type TripCategory = 'Beaches' | 'Cruises' | 'Mountains';

@Component({
  selector: 'app-travel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './travel.html',
  styleUrls: ['./travel.css'],
})
export class TravelComponent implements OnInit {
  trips: Trip[] = [];
  filtered: Trip[] = [];

  searchText = '';
  selectedTab: TripCategory = 'Beaches';

  pageSize = 8;
  pageIndex = 0;

  constructor(
    private tripData: TripData,
    private auth: Authentication,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  backToHome(): void {
    this.router.navigate(['/']);
  }

  addTrip(): void {
    this.router.navigate(['/add-trip']);
  }

  editTrip(code: any): void {
    localStorage.setItem('tripCode', String(code));
    this.router.navigate(['/edit-trip']);
  }

  deleteTrip(code: any): void {
    const tripCode = String(code);
    const ok = confirm(`Delete trip ${tripCode}?`);
    if (!ok) return;

    this.tripData.deleteTrip(tripCode).subscribe({
      next: () => this.loadTrips(),
      error: (err) => console.log('Delete failed', err),
    });
  }

  selectTab(tab: TripCategory): void {
    this.selectedTab = tab;
    this.pageIndex = 0;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchText = '';
    this.pageIndex = 0;
    this.applyFilters();
  }

  prevPage(): void {
    if (this.pageIndex > 0) this.pageIndex--;
  }

  nextPage(): void {
    const maxPage = Math.max(0, Math.ceil(this.filtered.length / this.pageSize) - 1);
    if (this.pageIndex < maxPage) this.pageIndex++;
  }

  get pagedRows(): Trip[] {
    const start = this.pageIndex * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get beachesCount(): number {
    return this.trips.filter(t => this.categoryOf(t) === 'Beaches').length;
  }
  get cruisesCount(): number {
    return this.trips.filter(t => this.categoryOf(t) === 'Cruises').length;
  }
  get mountainsCount(): number {
    return this.trips.filter(t => this.categoryOf(t) === 'Mountains').length;
  }

  formatStart(d: any): string {
    const dt = d ? new Date(d) : null;
    if (!dt || Number.isNaN(dt.getTime())) return '';
    return this.datePipe.transform(dt, 'MMM d, y') ?? '';
  }

  private loadTrips(): void {
    this.tripData.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips = value ?? [];
        this.pageIndex = 0;
        this.applyFilters();
      },
      error: (err) => {
        console.log('Load trips failed', err);
        this.trips = [];
        this.filtered = [];
      },
    });
  }

  private applyFilters(): void {
    const q = this.searchText.trim().toLowerCase();
    const tabbed = this.trips.filter(t => this.categoryOf(t) === this.selectedTab);

    if (!q) {
      this.filtered = tabbed;
      return;
    }

    this.filtered = tabbed.filter((t: any) => {
      const code = String(t.code ?? '').toLowerCase();
      const name = String(t.name ?? '').toLowerCase();
      const resort = String(t.resort ?? '').toLowerCase();
      const desc = String(t.description ?? '').toLowerCase();
      return code.includes(q) || name.includes(q) || resort.includes(q) || desc.includes(q);
    });
  }

  // Wireframe tabs: infer category from code prefix
  // B#### -> Beaches, C#### -> Cruises, M#### -> Mountains
  private categoryOf(t: any): TripCategory {
    const code = String(t?.code ?? '').toUpperCase();
    if (code.startsWith('C')) return 'Cruises';
    if (code.startsWith('M')) return 'Mountains';
    return 'Beaches';
  }
}