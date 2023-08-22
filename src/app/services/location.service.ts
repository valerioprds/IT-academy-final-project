import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = 'http://localhost:5000/api/v1/toilets';

  constructor(private http: HttpClient) {}

  addToiletLocation(location: any): Observable<any> {
    return this.http.post(this.apiUrl, location);
  }

  getToiletsLocation():Observable<any> {
    return this.http.get(this.apiUrl)
  } // observable es  una la unica maner para hacer llamadas http en angular 
}
