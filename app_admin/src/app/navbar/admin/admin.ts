import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { TripData } from '../../services/trip-data';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private tripData: TripData,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      code: ['', Validators.required], // ID
      name: ['', Validators.required], // Destination
      nights: [3, [Validators.required, Validators.min(1)]],
      days: [3, [Validators.required, Validators.min(1)]],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
    });
  }

  go(section: string): void {
    if (section === 'travel') this.router.navigate(['/travel']);
    if (section === 'reservations') this.router.navigate(['/reservations']);
  }

  onSubmit(): void {
    this.submitted = true;
    this.message = '';

    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    const trip = {
      code: v.code,
      name: v.name,
      length: `${v.nights} nights / ${v.days} days`,
      start: v.start,
      resort: v.resort,
      perPerson: Number(v.perPerson),
      image: 'default.jpg',
      description: 'Created from Admin page.',
    };

    this.tripData.addTrip(trip as any).subscribe({
      next: () => {
        this.message = 'Trip created.';
        this.form.reset({ nights: 3, days: 3 });
        this.submitted = false;
      },
      error: (err) => {
        console.log(err);
        this.message = 'Create failed.';
      },
    });
  }

  get f() {
    return this.form.controls;
  }
}