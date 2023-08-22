import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css'],
})
export class AddLocationComponent implements OnInit {
  ToiletlocationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.ToiletlocationForm = this.fb.group({
      name: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
    });
  }

  submitForm() {
    const newLocation = this.ToiletlocationForm.value;

    this.locationService.addToiletLocation(newLocation).subscribe(
      (response) => {
        console.log('Ubicación agregada:', response);
      },
      (error) => {
        console.error('Error al agregar ubicación:', error);
      }
    );
  } 
}
