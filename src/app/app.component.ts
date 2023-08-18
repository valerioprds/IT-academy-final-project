import { Component } from '@angular/core';
import { PlacesService } from './services/places.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Final Project';

  constructor(private placesSvc: PlacesService) {}



}
