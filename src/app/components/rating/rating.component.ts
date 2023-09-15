import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  ratingCount = 0;
  totalRating = 0;

  finalRating: any;

  ratingControl = new FormControl(0);

  getRating() {
    this.ratingCount++;
    this.totalRating += this.ratingControl.value! || 0;
    //console.log(this.ratingControl.value);
    this.finalRating = (this.totalRating / this.ratingCount).toFixed(2);
  }
}
