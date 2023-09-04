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
 // toiledIdforChildComponent = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.toiletForm = this.fb.group({
      toiletId: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    const header = new HttpHeaders({ contentType: 'application/json' });
    const toiletIdValue = this.toiletForm.get('toiletId')!.value;

    if (this.toiletForm.valid) {
      try {
        const response = await this.http
          .post('http://localhost:5000/api/v1/toilets', this.toiletForm.value, {
            headers: header,
          })
          .toPromise();

        if (response) {
          this.toastr.success(`${toiletIdValue} has been added successfully`);
          this.router.navigate(['/dashboard']);
        }
      } catch (error: any) {
        if (error.status === 400) {
          this.toastr.error(`${toiletIdValue} already exists`);
        } else {
          alert(error.message);
        }
      }
    }
    this.dialogRef.close('added')
  }


  onCancel() {
    this.dialogRef.close('canceled');
  }

  /*   transferData() {
    const toiletIdValue = this.toiletForm.get('toiletId')!.value;
    this.toiledIdforChildComponent = toiletIdValue;

    console.log(toiletIdValue);
  } */
}
