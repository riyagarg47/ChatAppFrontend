import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

public firstName: any;
public lastName: any;
public email: any;
public password: any;
public mobileNumber: any;
public confirmPassword: any;

  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

public goToSignIn: any = () => {
  this.router.navigate(['/']);
}

public signUpFunction: any = (form : NgForm) => {

  if(!this.firstName){
    this.toastr.warning('Please enter First Name');
  }else  if(!this.lastName){
    this.toastr.warning('Please enter Last Name');
  }else  if(!this.email){
    this.toastr.warning('Please enter Email id');
  }else  if(!this.password){
    this.toastr.warning('Please enter password');
  }else  if(!this.mobileNumber){
    this.toastr.warning('Please enter Mobile Number');
  }else  if(!this.confirmPassword){
    this.toastr.warning('Please re-enter password');
  }else{
    if(this.password != this.confirmPassword){
      this.toastr.warning('Password and Confirm password does not match')
    } else{
    let data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email.toLowerCase(),
      password: this.password,
      mobileNumber: this.mobileNumber,
    }
    console.log(data);
    this.appService.signupFunction(data).subscribe((apiResponse) => {
    console.log(apiResponse);

      if(apiResponse.status === 200) {
        this.toastr.success('Signup Successful');
        setTimeout(() => {
          this.goToSignIn();
        }, 2000);
      } else {
        this.toastr.error(apiResponse.message);
      }
    }, (err) => {
      this.toastr.error('Some error occured');
    });
   }//end inner else
  }// end else condition

}// end signup function

}
