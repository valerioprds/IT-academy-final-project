import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css'],
})
export class AddLocationComponent implements OnInit {
  ToiletlocationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit() {

  }

 
}
