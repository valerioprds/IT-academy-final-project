import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

//modules
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat'; // Importa AngularFireModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';


//components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { environment } from 'environments/environment';
import { LoadingMapComponent } from './components/map-components/loading-map/loading-map.component';
import { ViewMapComponent } from './components/map-components/view-map/view-map.component';
import { BtnLocationComponent } from './components/map-components/btn-location/btn-location.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UserRegistrationComponent,
    EmailVerificationComponent,
    RecoverPasswordComponent,
    SpinnerComponent,
    LoadingMapComponent,
    ViewMapComponent,
    BtnLocationComponent,



  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
