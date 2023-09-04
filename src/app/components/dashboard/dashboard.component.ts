import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from 'src/app/services/map.service';
import { MatDialog } from '@angular/material/dialog';
import { AddLocationComponent } from '../add-location/add-location.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  dataUser: any = {};
  coordinates: any = {}; // Initialize as an empty object

  toiletLocations: any = [];

  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';

  // coordenadas plaza españa
  lng = 2.1492734541257676;
  lat = 41.37519894542312;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private mapService: MapService,
    private dialogRef: MatDialog
  ) {}

  ngOnInit(): void {
    /* this.afAuth.currentUser.then((user) => {
      if (user && user.emailVerified) {
        this.dataUser = user;
        console.log(user);
      } else {
        this.router.navigate(['/login']);
      }
    }); */

    this.initializeMap();
    this.getToilets();
  }

  initializeMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.mapService.getMapStyle(),
      zoom: 14.5,
      center: [this.lng, this.lat],
    });
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    );


  }

  async getToilets() {
    const toilets = await this.mapService.getToilets();
    this.loadMap(toilets);
  }

  loadMap(toilets: any) {
    this.map.on('load', () => {
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

      // Add event listener for when a point is clicked
      this.map.on('click', 'points', (e) => {
        if (e.features!.length) {
          const feature = e.features![0];
          const popup = new mapboxgl.Popup({ offset: 25 }) // add popup offset
            .setLngLat(e.lngLat)
            .setHTML('<p>Toilet ID: ' + feature.properties! + '</p>')
            .addTo(this.map);
        }
      });

      // Change the cursor to a pointer when hovering over a point.
      this.map.on('mouseenter', 'points', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      // Change it back to a hand when it leaves.
      this.map.on('mouseleave', 'points', () => {
        this.map.getCanvas().style.cursor = '';
      });
    });
}


  openDialog() {
    const dialogRef = this.dialogRef.open(AddLocationComponent, {
      width: '500px',
      height: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'added') {
        // Fetch the latest list of toilets and update the map.
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
