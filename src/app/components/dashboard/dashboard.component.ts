import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from 'src/app/services/map.service';
import { MatDialog } from '@angular/material/dialog';
import { AddLocationComponent } from '../add-location/add-location.component';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  dataUser: any = {};
  toiletLocations: any = [];
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lng = 2.1492734541257676;
  lat = 41.37519894542312;
  directions!: any;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private mapService: MapService,
    private dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeMap();
    this.getToilets();
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.mapService.getMapStyle(),
      zoom: 14,
      center: [this.lng, this.lat],
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      })
    );

    this.directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking'
    });
    this.map.addControl(this.directions, 'top-right');

    this.map.on('load', () => {
      this.loadMapData();

      // Set user's current location as origin
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.directions.setOrigin([position.coords.longitude, position.coords.latitude]); // Highlighted correction
        });
      }
    });
  }

  async getToilets() {
    const toilets = await this.mapService.getToilets();
    this.loadMapData(toilets);
  }

  loadMapData(toilets: any = []) {
    this.map.addLayer({
      id: 'points',
      type: 'symbol',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: toilets,
        },
      },
      layout: {
        'icon-image': '{icon}-15',
        'icon-size': 2,
        'text-field': '{toiletId}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.9],
        'text-anchor': 'top',
      },
    });

    this.map.on('click', 'points', (e) => {
      if (e.features!.length) {
        const feature = e.features![0];
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setLngLat(e.lngLat)
          .setHTML('<p style="font-size: 16px;"> <strong>Address:</strong>' + feature.properties!['location'] + '</p>')
          .addTo(this.map);

        this.directions.setDestination(e.lngLat);
      }
    });

    this.map.on('mouseenter', 'points', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'points', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  openDialog() {
    const dialogRef = this.dialogRef.open(AddLocationComponent, {
      width: '500px',
      height: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'added') {
        this.initializeMap();
        this.getToilets();
      }
    });
  }

  LogOut() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
