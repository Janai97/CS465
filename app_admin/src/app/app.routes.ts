import { Routes } from '@angular/router';

import { HomeComponent } from './navbar/home/home';
import { TripListingComponent } from './trip-listing/trip-listing';
import { Login } from './login/login';
import { Register } from './navbar/register/register';
import { AdminComponent } from './navbar/admin/admin';
import { CheckoutComponent } from './navbar/checkout/checkout';
import { NewsComponent } from './navbar/news/news';
import { ReservationsComponent } from './navbar/reservations/reservations';
import { AddTrip } from './add-trip/add-trip';
import { EditTrip } from './edit-trip/edit-trip';

export const routes: Routes = [

  // Default route
  { path: '', component: HomeComponent, pathMatch: 'full' },

  // Main pages
  { path: 'travel', component: TripListingComponent },
  { path: 'news', component: NewsComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'reservations', component: ReservationsComponent },

  // Auth
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // Admin
  { path: 'admin', component: AdminComponent },

  // Trip CRUD
  { path: 'add-trip', component: AddTrip },
  { path: 'edit-trip', component: EditTrip },

  // Wildcard (ALWAYS LAST)
  { path: '**', redirectTo: '' }
];