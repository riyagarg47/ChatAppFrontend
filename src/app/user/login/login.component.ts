import { Component, OnInit } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

public email: any;
public password: any;

  constructor(public appService: AppService, public router: Router, private toastr: ToastrService) { }

  ngOnInit() {
  }

public signInFunction: any = () => {
  
  if(!this.email){
    this.toastr.warning('Please enter email')
  }else if(!this.password){
    this.toastr.warning('Please enter password')
  }else{
    let data = {
      email: this.email.toLowerCase(),
      password: this.password
    }
    this.appService.signinFunction(data).subscribe((apiResponse) => {
      console.log(apiResponse)

      if(apiResponse.status === 200){
        this.toastr.success('Welcome to Chat-O-Buddy', `Hello ${apiResponse.data.userDetails.firstName} !!`)
          Cookie.set('authtoken', apiResponse.data.authToken);
          Cookie.set('receiverId', apiResponse.data.userDetails.userId);
          Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
          this.router.navigate(['/home'])
      
      }else {
        this.toastr.error(apiResponse.message)
      }
    }, (err) => {
      this.toastr.error('Some error occured')
    });
  }//end else condition

}//end signin function






}
