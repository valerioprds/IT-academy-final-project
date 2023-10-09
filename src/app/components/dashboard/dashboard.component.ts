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
import { HttpClient } from '@angular/common/http';
import { ToiletServiceService } from 'src/app/services/toilet-service.service';
import { InfoComponent } from '../info/info.component';
import { AboutUsComponent } from '../about-us/about-us.component';

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

  isButtonVisible = true;

  toilets: [] = [];

  currentToilet: any = { averageRating: 0 };
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private mapService: MapService,
    private dialogRef: MatDialog,
    private observer: BreakpointObserver,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient,
    private toiletService: ToiletServiceService
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
  //sidenav responsive
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

    /* START OF DIRECTIONS BIT */

    // Initializing the MapboxDirections control
    this.directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking',
    });
    this.map.addControl(this.directions, 'top-left');

    this.map.on('dblclick', (e) => {
      this.showAddLocationDialog(e.lngLat);
    });

    let touchStartTime;

    this.map.on('touchstart', (e) => {
      touchStartTime = new Date().getTime(); // Record the time when touch starts
    });

    this.map.on('touchend', (e) => {
      const touchEndTime = new Date().getTime();
      const touchDuration = touchEndTime - touchStartTime;

      if (touchDuration >= 500) {
        // Check if touch lasted for at least 1 second
        this.showAddLocationDialog(e.lngLat);
      }
    });

    this.map.on('load', async () => {
      await this.loadToilets();
      const toilets = this.getToilets();
      console.log('from initializeMap ', toilets);

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
  /* END OF DIRECTIONS BIT */

  getToilets() {
    return this.mapService.getToilets(this.toilets); // return the toilets
  }

  showAddLocationDialog(lngLat: mapboxgl.LngLat) {
    const dialogRef = this.dialogRef.open(AddLocationComponent, {
      width: '400px',
      height: '200px',
      data: { lngLat: lngLat }, // Pass the clicked coordinates to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'added') {
        this.initializeMap();
        this.loadToilets();
      }
    });
  }

  async loadToilets() {
    this.toilets = await this.toiletService.getToilets();
    if (this.currentToilet != null && this.currentToilet['toiletId'] != null) {
      this.currentToilet = this.toiletService.getToiletsFromId(
        this.toilets,
        this.currentToilet['toiletId']
      );
      this.currentToilet = {
        ... this.currentToilet,
        averageRating: this.toiletService.getAverage(this.currentToilet)
      }
      console.log('postLoad', this.currentToilet)
    }
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
    /* ************POPUP*************** */

    this.map.on('click', 'points', (e) => {
      //console.log('hello from on click popup');
      if (e.features && e.features.length) {
        console.log(e.features);
        const feature = e.features[0];
        this.currentToilet = this.toiletService.getToiletsFromId(
          this.toilets,
          feature.properties['toiletId']
        ); // Assign the toiletId value to the variable
        this.currentToilet = {
          ...this.currentToilet,
          averageRating: this.toiletService.getAverage(this.currentToilet),
        };
        console.log('currentToilet', this.currentToilet);
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setLngLat(e.lngLat)
          .setHTML(
            `
          <p class="popup" style="font-size: 16px; color: black">
            <strong>${this.currentToilet['toiletId']}   </strong><br>
            Average cleanliness: ${this.currentToilet['averageRating']}<br></p>
            <button type="button" id="rate-button" class="btn btn-primary">Primary</button>
          `
          )
          .addTo(this.map);
        // console.log('from pop up   ' + currentToiletId);

        // Open the modal when 'rate-button' is clicked
        document
          .getElementById('rate-button')
          .addEventListener('click', function () {
            console.log('opening my modal for rating');
            //  console.log('Current Toilet ID:', this.currentToiletId);

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

    this.map.on('mouseenter', 'points', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'points', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  navigateToNearestToilet() {
    const toilets = this.getToilets();
    const nearestToilet = this.findNearestToilet(toilets);
    if (nearestToilet) {
      const destination = new mapboxgl.LngLat(
        nearestToilet.geometry.coordinates[0],
        nearestToilet.geometry.coordinates[1]
      );
      this.directions.setDestination(destination.toArray());
    }

    this.isButtonVisible = false;
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
        this.loadToilets();
      }
    });
  }


  showInfoDialog() {
    const dialogRef = this.dialogRef.open(InfoComponent, {
      width: '900px',
      height: '500px',
    })}


    shouwAboutUsDialog() {
      const dialogRef = this.dialogRef.open(AboutUsComponent, {
        width: '900px',
        height: '500px',
      })}

  LogOut() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
