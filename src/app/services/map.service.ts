import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import mapboxgl from 'mapbox-gl';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private readonly accessToken =
    'pk.eyJ1IjoidmFsZXJpb3ByZHMiLCJhIjoiY2xsaTM4MjFnMWlqMzNrcWh0d3J5aDNrZSJ9.p24UkToBjTKbmbq0MYedBQ';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
    (mapboxgl as any).accessToken = this.accessToken;
  }

  getMapStyle() {
    return 'mapbox://styles/mapbox/streets-v11';
  }

   getToilets(toilets: []) {
    return toilets.map((toilet: any) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          toilet.location.coordinates[0],
          toilet.location.coordinates[1],
        ],
      },
      properties: {
        toiletId: toilet.toiletId,
        icon: 'toilet',
        location: toilet.location.formattedAddress,
        rating: toilet.ratings, //calculo para guardar media
      },
    }));
  }

  postRating(toiletId: string, userRating: number) {
    const payload = {
      toiletId,
      userRating,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(
      'http://localhost:5000/api/v1/toilets/rateToilet',
      payload,
      {
        headers,
      }
    );
  }

  async addToilet(toiletIdValue: string, data: any) {
    const header = new HttpHeaders({ contentType: 'application/json' });

    try {
      const response = await this.http
        .post(
          'http://localhost:5000/api/v1/toilets',
          {
            toiletId: toiletIdValue,
            location: {
              type: 'Point',
              coordinates: [data.lngLat.lng, data.lngLat.lat],
            },
          },
          {
            headers: header,
          }
        )
        .toPromise();

      if (response) {
        this.toastr.success(`has been added successfully`, `${toiletIdValue}`);
        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      if (error.status === 400) {
        this.toastr.error(`already exists`, `${toiletIdValue}`);
      } else {
        throw error;
      }
    }
  }

  // src/app/services/map.service.ts

  //http://localhost:5000/api/v1/toilets
}
