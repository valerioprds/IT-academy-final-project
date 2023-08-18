import { Injectable } from '@angular/core';
import { LngLatLike, Map } from 'mapbox-gl';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map?: Map;

  get mapReady(): boolean {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.mapReady) throw Error('Map is not initiated');
    this.map?.flyTo({
      zoom: 14,
      center: coords,
    });
  }
}
