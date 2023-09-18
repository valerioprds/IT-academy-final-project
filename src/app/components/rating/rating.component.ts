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

  selectedRating: number = 0;
  averageRating: number = 0; // Example initial value. Ideally, this should be fetched from your backend.

  constructor(private mapService: MapService) {}
  ngOnInit(): void {}

  selectRating(rating: number) {
    this.selectedRating = rating;
  }

  async submitRating() {
    if (this.selectedRating > 0) {
      try {
        const toiletId = this.toiletId; // This should be dynamically set based on the toilet you're rating.
        await this.mapService.rateToilet(toiletId, this.selectedRating);
        const updatedToilet = await this.mapService.getToiletDetails(
          this.toiletId
        ); // Assuming you have a method to get individual toilet details

        //calcolare average  rating
        if (updatedToilet.ratingCount > 0) {
          this.averageRating =
            updatedToilet.ratingScore / updatedToilet.ratingCount;
        }

        alert('Thank you for your rating!');
      } catch (error) {
        alert('Error submitting your rating. Please try again later.1111111111111');
      }
    }
  }
}
