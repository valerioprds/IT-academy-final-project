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

  displayedAverageRatings: { [toiletId: string]: number } = {};

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {}

  postRating(toiletId: string, userRating: number) {
    const payload = {
      toiletId,
      userRating,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http
      .post('http://localhost:5000/api/v1/toilets/rateToilet', payload, {
        headers,
      })
      .subscribe(
        (res: any) => {
          this.toastr.success('Rating posted successfully');
          console.log('Average Rating from backend:', res.averageRating); // Log the average rating from backend
          this.displayedAverageRatings[toiletId] = res.averageRating;

        },
        (err) => {
          this.toastr.error('Failed to post rating:', err);
        }
      );
  }
}
