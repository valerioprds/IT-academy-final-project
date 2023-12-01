import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//modules
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat'; // Importa AngularFireModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

//components
import { AppComponent } from './app.component';
import { LoginComponent } from './account/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserRegistrationComponent } from './account/user-registration/user-registration.component';
import { EmailVerificationComponent } from './account/email-verification/email-verification.component';
import { RecoverPasswordComponent } from './account/recover-password/recover-password.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { environment } from 'environments/environment';
import { AddLocationComponent } from './components/add-location/add-location.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RatingComponent } from './components/rating/rating.component';
import { InfoComponent } from './components/user-guide/info.component';
import { AboutUsComponent } from './components/about-us/about-us.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UserRegistrationComponent,
    EmailVerificationComponent,
    RecoverPasswordComponent,
    SpinnerComponent,
    AddLocationComponent,
    RatingComponent,
    InfoComponent,
    AboutUsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({ positionClass: 'toast-top-full-width' }), // ToastrModule added
    HttpClientModule,
    MatDialogModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
