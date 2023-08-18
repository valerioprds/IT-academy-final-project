import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;

  // to visualize the password
  visible:boolean = true;
  changetype:boolean =true;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private firebaseError: FirebaseCodeErrorService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}


  viewpass(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  login() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.loading = true;

    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        if (user.user?.emailVerified) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/email-verification']);
        }
      })
      .catch((error) => {
        this.loading = false;
        console.log(error);
        this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
      });
  }
}
