import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule }   from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { EmailInputComponent } from './email-input/email-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      { path: 'sign-up', component: SignupComponent},
      { path: 'emailVerification', component: EmailInputComponent},
      { path: 'resetPassword/:userId', component: PasswordResetComponent},
      { path: 'home', component: HomeComponent}
    ])
  ],
  declarations: [LoginComponent, SignupComponent, HomeComponent, PasswordResetComponent, EmailInputComponent]
})
export class UserModule { }
