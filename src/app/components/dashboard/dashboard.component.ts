import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { MapService } from 'src/app/services/map.service';

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

  lat = 41.38730104377958;
  lng = 2.1699341966931276;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private mapService: MapService
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
      container: "map",
      style: this.mapService.getMapStyle(),
      zoom: 14.5,
      center: [2.1699341966931276, 41.38730104377958], // plaza cataluña
    });
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
            features: toilets
          }
        },
        layout: {
          "icon-image": "{icon}-15",
          "icon-size": 2,
          "text-field": "{toiletId}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.9],
          "text-anchor": "top"
        }
      });
    });
  }





  LogOut() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}

