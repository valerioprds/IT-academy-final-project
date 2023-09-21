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
    const res: any = await this.http
      .get('http://localhost:5000/api/v1/toilets')
      .toPromise();
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
        location: toilet.location.formattedAddress,
      },
    }));
  }

  // added on 18/09
 /*  async rateToilet(toiletId: string, userRating: number) {
    const endpoint = 'http://localhost:5000/api/v1/toilets';
    const payload = { toiletId, userRating };

    try {
      const response = await this.http.post(endpoint, payload).toPromise();
      return response;
    } catch (error) {
      throw new Error('Failed to rate the toilet. Please try again later.222222');
    }
  }


  async getToiletDetails(toiletId: string) {
    const endpoint = `http://localhost:5000/api/v1/toilets`;
    try {
      const response: any = await this.http.get(endpoint).toPromise();
      return response.data;  // Assuming the toilet data is wrapped in a "data" property in the response
    } catch (error) {
      throw new Error('Failed to fetch toilet details.');
    }
  } */

}
