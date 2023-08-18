import { Component } from '@angular/core';
import { PlacesService } from 'src/app/services/places.service';
import { MapService } from '../../../services/map.service';

@Component({
  selector: 'app-btn-location',
  templateUrl: './btn-location.component.html',
  styleUrls: ['./btn-location.component.css'],
})
export class BtnLocationComponent {
  constructor(private placesSvc: PlacesService, private mapSvc: MapService) {}

  myLocation() {
    if (!this.placesSvc.locationReady)
      throw Error('We cannot locate you on the map');
    if (!this.mapSvc.mapReady) throw Error('no map available');

    this.mapSvc.flyTo(this.placesSvc.location!);
  }
}
