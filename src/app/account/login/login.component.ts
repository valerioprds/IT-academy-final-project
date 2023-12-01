import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FirebaseCodeErrorService } from 'src/app/services/firebase-code-error.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate(
          '1s ease-out',
          style({ transform: 'translateX(0)', opacity: 1 })
        ),
      ]),
    ]),
    trigger('focusPanel', [
      state(
        'inactive',
        style({
          transform: 'scale(1)',
        })
      ),
      state(
        'active',
        style({
          transform: 'scale(1.05)',
        })
      ),
      transition('inactive => active', animate('500ms ease-in')),
      transition('active => inactive', animate('500ms ease-out')),
    ]),
    trigger('flipIcon', [
      state(
        'default',
        style({
          transform: 'rotate(0)',
        })
      ),
      state(
        'flipped',
        style({
          transform: 'rotate(180deg)',
        })
      ),
      transition('default <=> flipped', animate('300ms')),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  // animations
  focusState: string = 'inactive';
  iconState: string = 'default';

  toggleFocusState() {
    this.focusState = this.focusState === 'inactive' ? 'active' : 'inactive';
  }
  toggleIconState() {
    this.iconState = this.iconState === 'default' ? 'flipped' : 'default';
  }

  loginForm: FormGroup;
  loading: boolean = false;

  // to visualize the password
  visible: boolean = true;
  changetype: boolean = true;

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

  viewpass() {
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
        // console.log(user);
        if (user.user?.emailVerified) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/email-verification']);
        }
      })
      .catch((error) => {
        this.loading = false;
        // console.log(error);
        this.toastr.error(this.firebaseError.codeError(error.code), 'Error');
      });
  }
}
