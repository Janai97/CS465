import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrls: ['./edit-trip.css'],
})
export class EditTrip implements OnInit {
  editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  private originalTripCode: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripData
  ) {}

  ngOnInit(): void {
    const tripCode = localStorage.getItem('tripCode');

    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    this.originalTripCode = tripCode;

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [{ value: tripCode, disabled: true }, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.tripService.getTrip(tripCode).subscribe({
      next: (value: Trip) => {
        this.trip = value;

        // IMPORTANT: format start date for <input type="date">
        const startValue = value.start ? String(value.start).slice(0, 10) : '';

        this.editForm.patchValue({
          ...value,
          start: startValue,
        });

        this.message = 'Trip: ' + tripCode + ' retrieved';
        console.log(this.message);
      },
      error: (error: any) => {
        console.log('Error: ' + error);
        this.message = 'Error retrieving trip from database';
      },
    });
  }

  public onSubmit(): void {
    this.submitted = true;

    if (this.editForm.invalid) return;

    const formData = this.editForm.getRawValue() as Trip;

    // ensure we update the ORIGINAL code
    formData.code = this.originalTripCode;

    // ensure correct type
    (formData as any).perPerson = Number((formData as any).perPerson);

    this.tripService.updateTrip(formData).subscribe({
      next: (data: any) => {
        console.log(data);
        this.router.navigate(['']);
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      },
    });
  }

  get f() {
    return this.editForm.controls;
  }
}