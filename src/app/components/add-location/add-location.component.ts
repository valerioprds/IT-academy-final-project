import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css'],
})
export class AddLocationComponent implements OnInit {
  toiletForm!: FormGroup;

  constructor(
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
    const header = new HttpHeaders({ contentType: 'application/json' });
    const toiletIdValue = this.toiletForm.get('toiletId')!.value;

    if (this.toiletForm.valid) {
      try {
        const response = await this.http
          .post(
            'http://localhost:5000/api/v1/toilets',
            {
              toiletId: toiletIdValue,
              location: {
                type: 'Point',
                coordinates: [this.data.lngLat.lng, this.data.lngLat.lat],
              },
            },
            {
              headers: header,
            }
          )
          .toPromise();

        if (response) {
          this.toastr.success(
            `has been added successfully`,
            `${toiletIdValue}`
          );
          this.router.navigate(['/dashboard']);
        }
      } catch (error: any) {
        if (error.status === 400) {
          this.toastr.error(`already exists`, `${toiletIdValue}`);
        } else {
          alert(error.message);
        }
      }
    }
    this.dialogRef.close('added');
  }

  onCancel() {
    this.dialogRef.close('canceled');
  }
}
