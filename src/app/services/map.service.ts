import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const res: any = await this.http
      .get('http://localhost:5000/api/v1/toilets')
      .toPromise();
    return res.data
      .filter(
        (toilet: any) =>
          toilet?.location?.coordinates != null &&
          toilet.location.coordinates.length == 2
      )
      .map((toilet: any) => ({
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
}
