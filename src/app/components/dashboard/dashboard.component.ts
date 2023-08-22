import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import { PlacesService } from 'src/app/services/places.service';
import mapboxgl from 'mapbox-gl';

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

  lat = 41.38730104377958;
  lng = 2.1699341966931276;

  constructor(
    private placesSvc: PlacesService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private locationSvc: LocationService
  ) {}

  /*   get locationReady() {
    return this.placesSvc.locationReady;
  } */

  ngOnInit(): void {
    /* this.afAuth.currentUser.then((user) => {
      if (user && user.emailVerified) {
        this.dataUser = user;
        console.log(user);
      } else {
        this.router.navigate(['/login']);
      }
    }); */

    this.setToiletsOnMap();

  }

  createMap() {
    mapboxgl as typeof mapboxgl;
    this.map = new mapboxgl.Map({
      accessToken:
        'pk.eyJ1IjoiZHBpZXRyb2NhcmxvIiwiYSI6ImNram9tOGFuMTBvb3oyeXFsdW5uYmJjNGQifQ._zE6Mub0-Vpl7ggMj8xSUQ',
      container: 'map',
      style: this.style,
      zoom: 2,
      center: [this.lng, this.lat]
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
   // this.map.addSource('points',this.toiletLocations)

    //buscar en la documentacion como añadir
  }

  setToiletsOnMap() {
    this.locationSvc.getToiletsLocation().subscribe((res) => {
      this.toiletLocations = res.data;
      this.createMap();
    });
  }

  LogOut() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}



// buscar como agregar data al mapbox
