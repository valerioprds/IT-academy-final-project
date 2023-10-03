import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css'],
})
export class AddLocationComponent implements OnInit {
  toiletForm!: FormGroup;

  constructor(
    private mapService: MapService,

    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    console.log(this.data);
    this.toiletForm = this.fb.group({
      toiletId: ['', [Validators.required, Validators.minLength(6)]],
      //tengo que añadir input y parle longitud y latitud
      //address: ['', [Validators.required, Validators.minLength(6)]],
      //rating: [''],
    });
  }

  async onSubmit() {
    console.log('hello from onsubmit');
    const toiletIdValue = this.toiletForm.get('toiletId')!.value;

    if (this.toiletForm.valid) {
      try {
        await this.mapService.addToilet(toiletIdValue, this.data);
        this.dialogRef.close('added');
      } catch (error) {
        alert(error.message);
      }
    }
  }

  onCancel() {
    this.dialogRef.close('canceled');
  }
}
