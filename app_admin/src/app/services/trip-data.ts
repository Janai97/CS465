import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';

@Injectable({
  providedIn: 'root',
})
export class TripData {
  private tripsUrl = 'http://localhost:3000/api/trips';

  constructor(private http: HttpClient) {}

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripsUrl);
  }

  addTrip(trip: Trip): Observable<any> {
    return this.http.post(this.tripsUrl, trip);
  }

  getTrip(tripCode: string): Observable<Trip> {
    // console.log
    return this.http.get<Trip>(`${this.tripsUrl}/${tripCode}`);
  }

  updateTrip(formData: Trip) : Observable<Trip> {
    // console.log
    return this.http.put<Trip>(this.tripsUrl + '/' + formData.code, formData);
  }
}
