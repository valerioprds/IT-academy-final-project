import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  location?: [number, number];
  //toiletLocations ?: [number, number];

  get locationReady(): boolean {
    return !!this.location; // con doble !! es un dato true
  }

  constructor() {this.getLocation()}

  public async getLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.location = [coords.longitude, coords.latitude]; // in here i can put any coord of a specific location
          resolve(this.location); // 2.1757974317571525, 41.39643021990167
        },
        (error) => {
          alert('could not get geolocation');
          reject();
        }
      );
    });
  }



}
