import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent implements OnInit {
  registerForm: FormGroup;
  loading: boolean = false;

  visible: boolean = true;
  visibleRepeatPass: boolean = true;
  changetype: boolean = true;
  changetypeRepeatPass: boolean = true;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private toastr: ToastrService,
    private router: Router,
    private firebaseError: FirebaseCodeErrorService,

  ) {
    this.registerForm = this.fb.group({

      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],

    });
  }
  ngOnInit(): void {}

  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  viewRepeatPass() {
    this.visibleRepeatPass = !this.visibleRepeatPass;
    this.changetypeRepeatPass = !this.changetypeRepeatPass;
  }

  register() {
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const repeatPassword = this.registerForm.value.repeatPassword;

    //console.log(this.registerForm);

    if (password !== repeatPassword) {
      this.toastr.error('the password does not match', 'Error');
      return;
    }
    this.loading = true;

    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.verifyEmail();
      })
      .catch((error) => {
        this.loading = false;

        this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
      });
  }

  verifyEmail() {
    this.afAuth.currentUser
      .then((user) => user?.sendEmailVerification())
      .then(() => {
        this.toastr.info(
          'We sent you an email to verify your account',
          'Check your inbox'
        );
        this.router.navigate(['/login']);
      });
  }
}
