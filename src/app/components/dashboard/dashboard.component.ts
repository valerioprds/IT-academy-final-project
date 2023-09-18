import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from 'src/app/services/map.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AddLocationComponent } from '../add-location/add-location.component';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';

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

  ratingCount = 0;
  totalRating = 0;

  finalRating: any;

  ratingControl = new FormControl(0);

  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  @Input() toiletId: string;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private mapService: MapService,
    private dialogRef: MatDialog,
    private observer: BreakpointObserver,
    private cdRef: ChangeDetectorRef
  ) {}

  getUserVerification() {
    this.afAuth.currentUser.then((user) => {
      if (user && user.emailVerified) {
        this.dataUser = user;
        console.log(user);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
  ngOnInit(): void {
    this.initializeMap();

    // this.getUserVerification();

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
      this.cdRef.detectChanges();
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

    this.map.on('click', 'points', (e) => {
      console.log('hello from on click ');
      if (e.features && e.features.length) {
        console.log(e.features);
        const feature = e.features[0];
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setLngLat(e.lngLat)
          .setHTML(
            `
          <p class="popup" style="font-size: 16px; color: black">
            <strong>Dirección:</strong>${feature.properties['location']}
            <button id="rate-button">Calificar</button>
          </p>
          `
          )
          .addTo(this.map);
        console.log('from pop up   ' + feature.properties['toiletId']);

        // Open the modal when 'rate-button' is clicked
        document
          .getElementById('rate-button')
          .addEventListener('click', function () {
            const modal = document.getElementById('myModal');
            modal.style.display = 'block';
            const closeBtn = document.querySelector('.close') as HTMLElement;
            closeBtn.onclick = function () {
              modal.style.display = 'none';
            };
            window.onclick = function (event) {
              if (event.target == modal) {
                modal.style.display = 'none';
              }
            };
          });
      }
    });

    /* this.map.on('click', 'points', (e) => {
      console.log('hello from on click ');
      if (e.features!.length) {
        console.log(e.features!);
        const feature = e.features![0];
        const popupContent = `
          <p class="popup" style="font-size: 16px; color: black">
            <strong>Address:</strong>${feature.properties!['location']}
            <div id="rating-stars">
              <!-- Here you'll represent the rating with stars (e.g., ★★★☆☆) -->
              ${Array(5).fill('☆').map((star, index) =>
                  index < feature.properties!['rating'] ? '★' : star).join('')}
            </div>
            <button id="rate-button">Rate</button>
          </p>
        `;
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(this.map);
        const rateButton = document.getElementById('rate-button');
        if (rateButton) {
          rateButton.addEventListener('click', () => {
            // Handle the rating logic here,
            // maybe opening a modal where users can select the rating
            '<button mat-button (click)="openDialog()">Open Dialog</button>'

          });
        }
      }
    }); */

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

  openDialogWithRating() {
    const dialogRef = this.dialogRef.open(AddLocationComponent, {
      width: '500px',
      height: '400px',
      data: { isRating: true }, // Send data to know it's for rating
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'added') {
        this.initializeMap();
        this.getToilets();
      }
      // Add logic to handle when rating is updated if needed
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

  async getRating() {
    this.ratingCount++;
    this.totalRating += this.ratingControl.value || 0;
    this.finalRating = (this.totalRating / this.ratingCount).toFixed(2);

    // Assuming you have the toiletId available in this component
    try {
      await this.mapService.updateRating(
        this.toiletId,
        this.ratingControl.value
      );
    } catch (err) {
      console.error('Failed to update rating:', err);
      // Handle the error appropriately, such as displaying a message to the user
    }
  }

  LogOut() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
