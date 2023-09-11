import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from 'src/app/services/map.service';
import { MatDialog } from '@angular/material/dialog';
import { AddLocationComponent } from '../add-location/add-location.component';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

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
  userCurrentLocation: mapboxgl.LngLat = new mapboxgl.LngLat(
    this.lng,
    this.lat
  ); // User's initial location

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private mapService: MapService,
    private dialogRef: MatDialog,
    private observer: BreakpointObserver
  ) {}

  ngOnInit(): void {
    /*  this.afAuth.currentUser.then((user) => {
      if (user && user.emailVerified) {
        this.dataUser = user;
        console.log(user);
      } else {
        this.router.navigate(['/login']);
      }
    }); */
    this.initializeMap();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userCurrentLocation = new mapboxgl.LngLat(
          position.coords.longitude,
          position.coords.latitude
        );
        this.directions.setOrigin(this.userCurrentLocation.toArray());
      });
    }
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width:800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
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
    this.map.addControl(new mapboxgl.FullscreenControl());

    this.directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking',
    });
    this.map.addControl(this.directions, 'top-left');

    this.map.on('load', async () => {
      const toilets = await this.getToilets();
      this.loadMapData(toilets);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.directions.setOrigin([
            position.coords.longitude,
            position.coords.latitude,
          ]);
        });
      }
    });
  }

  async getToilets() {
    return await this.mapService.getToilets(); // return the toilets
  }

  loadMapData(toilets: any = []) {
    if (!this.map.getLayer('points')) {
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
    }

    // Add event listener for when a point is clicked
    this.map.on('click', 'points', (e) => {
      if (e.features!.length) {
        console.log(e.features!);
        const feature = e.features![0];
        const popup = new mapboxgl.Popup({ offset: 25 }) // add popup offset
          .setLngLat(e.lngLat)
          .setHTML(
            '<p style="font-size: 16px;"> <strong>Address:</strong>' +
              feature.properties!['location'] +
              '</p>'
          )
          .addTo(this.map);
        console.log('from pop up   ' + feature.properties);
      }
    });

    this.map.on('mouseenter', 'points', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'points', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  async navigateToNearestToilet() {
    const toilets = await this.getToilets();
    const nearestToilet = this.findNearestToilet(toilets);
    if (nearestToilet) {
      const destination = new mapboxgl.LngLat(
        nearestToilet.geometry.coordinates[0],
        nearestToilet.geometry.coordinates[1]
      );
      this.directions.setDestination(destination.toArray());
    }
  }

  findNearestToilet(toilets: any[]): any {
    let nearestDistance = Infinity;
    let nearestToilet = null;

    toilets.forEach((toilet) => {
      const toiletLocation = new mapboxgl.LngLat(
        toilet.geometry.coordinates[0],
        toilet.geometry.coordinates[1]
      );
      const distance = this.userCurrentLocation.distanceTo(toiletLocation);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestToilet = toilet;
      }
    });

    return nearestToilet;
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
