import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private readonly accessToken =
    'pk.eyJ1IjoidmFsZXJpb3ByZHMiLCJhIjoiY2xsaTM4MjFnMWlqMzNrcWh0d3J5aDNrZSJ9.p24UkToBjTKbmbq0MYedBQ';

  constructor(private http: HttpClient) {
    (mapboxgl as any).accessToken = this.accessToken;
  }

  getMapStyle() {
    return 'mapbox://styles/mapbox/streets-v11';
  }

  async getToilets() {
    const res: any = await this.http.get('http://localhost:5000/api/v1/toilets').toPromise();
    return res.data.map((toilet: any) => ({
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
      },
      
    }));


  }
}
