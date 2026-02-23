import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule,} from '@angular/forms';
import { Router } from '@angular/router';

import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrls: ['./add-trip.css'],
})
export class AddTrip implements OnInit {
  addForm!: FormGroup;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripService: TripData
  ) {}

  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    this.submitted = true;
    this.message = '';

    if (this.addForm.invalid) return;

    const formData = this.addForm.getRawValue();

    const newTrip: Trip = {
      ...formData,
      perPerson: Number(formData.perPerson),
    };

    this.tripService.addTrip(newTrip).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (error: any) => {
        console.log('Error: ' + error);
        this.message = 'Error creating trip';
      },
    });
  }

  get f() {
    return this.addForm.controls;
  }
}