import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapService } from 'src/app/services/map.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent implements OnInit {
  @Input() toiletId: string;

  // Variables to keep track of the total sum and count of ratings
  totalRatingSum: number = 0;
  totalRatingCount: number = 0;
  averageRating: number = 0;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {}

  postRating(toiletId: string, userRating: number) {
    // Update the total sum and count of ratings
    this.totalRatingSum += userRating;
    this.totalRatingCount++;

    // Calculate the average rating
    this.averageRating = this.totalRatingSum / this.totalRatingCount;

    const payload = {
      toiletId,
      userRating,
    };

    console.log(payload);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .post('http://localhost:5000/api/v1/toilets/rateToilet', payload, {
        headers,
      })
      .subscribe(
        (res) => {
          this.toastr.success('Rating posted successfully:');
          console.log('Average Rating:', this.averageRating); // Log the average rating
        },
        (err) => {
          this.toastr.error('Failed to post rating:', err);
        }
      );
  }
}
