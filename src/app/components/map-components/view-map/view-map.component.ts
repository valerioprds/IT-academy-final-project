import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Map, Marker, Popup } from 'mapbox-gl';
import { MapService } from 'src/app/services/map.service';
import { PlacesService } from 'src/app/services/places.service';

@Component({
  selector: 'app-view-map',
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.css'],
})
export class ViewMapComponent implements AfterViewInit {
  @ViewChild('mapDiv') mapDivElement!: ElementRef;

  constructor(private placeSvc: PlacesService, private mapSvc: MapService) {}

  ngAfterViewInit() {
    if (!this.placeSvc.location) throw Error('there is no location here');

    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL ejemplo: mapbox://styles/mapbox/dark-v10
      center: this.placeSvc.location, // starting position [lng, lat]
      zoom: 16, // starting zoom
    });

    const popup = new Popup().setHTML(`<h6>I am Here</h6>
    <span>This is my location</span>`);

    new Marker({ color: '#0526e6' , })
      .setLngLat(this.placeSvc.location)
      .setPopup(popup)
      .addTo(map);

      this.mapSvc.setMap(map)
  }



}
