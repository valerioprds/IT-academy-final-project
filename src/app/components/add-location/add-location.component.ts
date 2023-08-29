import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.toiletForm = this.fb.group({
      toiletId: ['', [Validators.required, Validators.maxLength(20)]],
      address: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    const header = new HttpHeaders({ contentType: 'application/json' });

    if (this.toiletForm.valid) {
      try {
        const response = await this.http
          .post('http://localhost:5000/api/v1/toilets', this.toiletForm.value, {
            headers: header,
          })
          .toPromise();

        if (response) {
          this.toastr.success('toilet added succesfully');
          this.router.navigate(['/dashboard']);
        }
      } catch (error: any) {
        if (error.status === 400) {
          this.toastr.error('toilet already exists');
        } else {
          alert(error.message);
        }
      }
    }
  }
}
