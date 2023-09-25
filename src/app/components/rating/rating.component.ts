import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent implements OnInit {
  @Input() toiletId: string;

  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    console.log('Received toiletId:', this.toiletId);
  }

  postRating(toiletId: string, userRating: number) {
    const payload = {
      toiletId,
      userRating,
    };

    console.log(payload); //toiletId is undefined

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .post('http://localhost:5000/api/v1/toilets/rateToilet', payload, {
        headers,
      })
      .subscribe(
        (res) => {
          console.log('Rating posted successfully:', res);
        },
        (err) => {
          console.error('Failed to post rating:', err);
        }
      );
  }

 
}
